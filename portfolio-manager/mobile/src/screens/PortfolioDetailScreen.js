import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useResponsive } from '../utils/useResponsive';
import { colors } from '../theme/colors';

const GET_PORTFOLIO = gql`
  query GetPortfolio($id: ID!) {
    portfolio(id: $id) {
      id
      name
      description
      status
      totalValue
      assets {
        id
        name
        symbol
        type
        quantity
        price
        value
        currency
        purchaseDate
        notes
      }
      createdAt
    }
  }
`;

const DELETE_ASSET = gql`
  mutation DeleteAsset($id: ID!) {
    deleteAsset(id: $id)
  }
`;

export const PortfolioDetailScreen = ({ route, navigation }) => {
  const { portfolioId } = route.params;
  const { isTablet, isSmallScreen } = useResponsive();
  const { data, loading, error, refetch } = useQuery(GET_PORTFOLIO, {
    variables: { id: portfolioId },
  });
  const [deleteAsset] = useMutation(DELETE_ASSET, {
    onCompleted: () => {
      refetch();
    },
  });

  const portfolio = data?.portfolio;

  // Calculate chart data - MUST be before any early returns
  const chartData = useMemo(() => {
    if (!portfolio?.assets || portfolio.assets.length === 0) {
      return null;
    }

    const assets = portfolio.assets;
    const screenWidth = Dimensions.get('window').width - 48; // Accounting for margins
    
    // Pie chart data - portfolio composition
    const pieData = assets.map((asset, index) => {
      const colors = ['#FF3B30', '#34C759', '#007AFF', '#FF9500', '#AF52DE', '#FF2D55'];
      return {
        name: asset.symbol || asset.name.substring(0, 10),
        value: asset.value,
        color: colors[index % colors.length],
        legendFontColor: '#FFFFFF',
        legendFontSize: 12,
      };
    });

    // Generate historical data (simulated - would come from API in production)
    const historyData = [];
    const portfolioCreatedDate = new Date(portfolio.createdAt);
    const daysSinceCreation = Math.floor((Date.now() - portfolioCreatedDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysToShow = Math.min(30, daysSinceCreation);
    
    for (let i = daysToShow; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate daily value changes (±2%)
      const baseValue = portfolio.totalValue;
      const randomChange = (Math.random() - 0.5) * 0.04; // ±2%
      const simulatedValue = baseValue * (1 + randomChange * (daysToShow - i) / daysToShow);
      
      historyData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: simulatedValue,
      });
    }

    // Gains/Losses breakdown by asset
    const gainsLossesData = assets.map((asset, index) => {
      // Simulate 10-30% gains/losses
      const percentageChange = (Math.random() - 0.3) * 0.4; // -30% to +10% weighted toward gains
      const currentPrice = asset.price * (1 + percentageChange);
      const currentValue = asset.quantity * currentPrice;
      const gainLoss = currentValue - asset.value;
      
      return {
        name: asset.symbol || asset.name.substring(0, 8),
        gain: gainLoss > 0 ? gainLoss : 0,
        loss: gainLoss < 0 ? Math.abs(gainLoss) : 0,
      };
    });

    return {
      pieData,
      historyData,
      gainsLossesData,
      screenWidth,
    };
  }, [portfolio]);

  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeleteAsset = (assetId, assetName) => {
    Alert.alert(
      'Delete Asset',
      `Are you sure you want to delete ${assetName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAsset({ variables: { id: assetId } });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading portfolio</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={[styles.portfolioCard, isTablet && styles.portfolioCardTablet]}>
        <Text style={[styles.portfolioName, isTablet && styles.portfolioNameTablet]}>
          {portfolio?.name}
        </Text>
        {portfolio?.description && (
          <Text style={[styles.portfolioDescription, isTablet && styles.portfolioDescriptionTablet]}>
            {portfolio?.description}
          </Text>
        )}
        <View style={styles.portfolioStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, isTablet && styles.statLabelTablet]}>Total Value</Text>
            <Text style={[styles.statValue, isTablet && styles.statValueTablet]}>
              {formatCurrency(portfolio?.totalValue)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, isTablet && styles.statLabelTablet]}>Assets</Text>
            <Text style={[styles.statValue, isTablet && styles.statValueTablet]}>
              {portfolio?.assets?.length || 0}
            </Text>
          </View>
        </View>
      </Card>

      {/* Charts Section */}
      {chartData && portfolio?.assets?.length > 0 && (
        <>
          {/* Portfolio Composition Pie Chart */}
          <Card style={[styles.chartCard, isTablet && styles.chartCardTablet]}>
            <Text style={[styles.chartTitle, isTablet && styles.chartTitleTablet]}>
              Portfolio Composition
            </Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={chartData.pieData}
                width={chartData.screenWidth}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>
          </Card>

          {/* History Line Chart */}
          <Card style={[styles.chartCard, isTablet && styles.chartCardTablet]}>
            <Text style={[styles.chartTitle, isTablet && styles.chartTitleTablet]}>
              Portfolio History (30 Days)
            </Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: chartData.historyData.map(d => d.date),
                  datasets: [
                    {
                      data: chartData.historyData.map(d => d.value),
                    },
                  ],
                }}
                width={chartData.screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: '#1C1C1E',
                  backgroundGradientFrom: '#1C1C1E',
                  backgroundGradientTo: '#1C1C1E',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#34C759',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </Card>

          {/* Gains/Losses Bar Chart */}
          <Card style={[styles.chartCard, isTablet && styles.chartCardTablet]}>
            <Text style={[styles.chartTitle, isTablet && styles.chartTitleTablet]}>
              Gains & Losses by Asset
            </Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: chartData.gainsLossesData.map(d => d.name),
                  datasets: [
                    {
                      data: chartData.gainsLossesData.map(d => d.gain),
                    },
                    {
                      data: chartData.gainsLossesData.map(d => d.loss),
                    },
                  ],
                }}
                width={chartData.screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: '#1C1C1E',
                  backgroundGradientFrom: '#1C1C1E',
                  backgroundGradientTo: '#1C1C1E',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: '#38383A',
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                showLegend={false}
              />
            </View>
          </Card>
        </>
      )}

      <View style={styles.header}>
        <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>Assets</Text>
        <Button
          title="+ Add Asset"
          onPress={() => navigation.navigate('CreateAsset', { portfolioId })}
          style={styles.addButton}
        />
      </View>

      {portfolio?.assets?.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No assets in this portfolio</Text>
        </Card>
      ) : (
        portfolio?.assets?.map((asset) => (
          <Card key={asset.id} style={styles.assetCard}>
            <View style={styles.assetHeader}>
              <View style={styles.assetInfo}>
                <Text style={[styles.assetName, isTablet && styles.assetNameTablet]}>
                  {asset.name}
                </Text>
                {asset.symbol && (
                  <Text style={[styles.assetSymbol, isTablet && styles.assetSymbolTablet]}>
                    {asset.symbol}
                  </Text>
                )}
              </View>
              <Text style={[styles.assetValue, isTablet && styles.assetValueTablet]}>
                {formatCurrency(asset.value, asset.currency)}
              </Text>
            </View>
            <View style={styles.assetDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{asset.type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quantity:</Text>
                <Text style={styles.detailValue}>{asset.quantity}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Price:</Text>
                <Text style={styles.detailValue}>
                  {formatCurrency(asset.price, asset.currency)}
                </Text>
              </View>
              {asset.purchaseDate && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Purchase Date:</Text>
                  <Text style={styles.detailValue}>{formatDate(asset.purchaseDate)}</Text>
                </View>
              )}
            </View>
            {asset.notes && (
              <Text style={styles.assetNotes}>{asset.notes}</Text>
            )}
            <View style={styles.assetActions}>
              <Button
                title="Edit"
                variant="secondary"
                onPress={() => navigation.navigate('EditAsset', { assetId: asset.id })}
                style={styles.actionButton}
              />
              <Button
                title="Delete"
                variant="danger"
                onPress={() => handleDeleteAsset(asset.id, asset.name)}
                style={styles.actionButton}
              />
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portfolioCard: {
    margin: 16,
  },
  portfolioCardTablet: {
    margin: 24,
  },
  portfolioName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  portfolioNameTablet: {
    fontSize: 32,
  },
  portfolioDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  portfolioDescriptionTablet: {
    fontSize: 18,
  },
  portfolioStats: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statLabelTablet: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  statValueTablet: {
    fontSize: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitleTablet: {
    fontSize: 24,
  },
  addButton: {
    minWidth: 120,
  },
  assetCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  assetNameTablet: {
    fontSize: 22,
  },
  assetSymbol: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  assetSymbolTablet: {
    fontSize: 16,
  },
  assetValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  assetValueTablet: {
    fontSize: 22,
  },
  assetDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  assetNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    fontStyle: 'italic',
  },
  assetActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    marginBottom: 16,
  },
  chartCard: {
    margin: 16,
    marginBottom: 16,
  },
  chartCardTablet: {
    margin: 24,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  chartTitleTablet: {
    fontSize: 22,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});



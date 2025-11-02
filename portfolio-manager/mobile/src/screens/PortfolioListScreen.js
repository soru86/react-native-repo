import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FilterDialog } from '../components/FilterDialog';
import { useAuth } from '../hooks/useAuth';
import { useResponsive } from '../utils/useResponsive';
import { colors } from '../theme/colors';

const GET_MY_PORTFOLIOS = gql`
  query GetMyPortfolios {
    myPortfolios {
      id
      name
      description
      status
      totalValue
      assets {
        id
        name
        symbol
        value
        price
        quantity
        purchaseDate
      }
      createdAt
    }
  }
`;

export const PortfolioListScreen = ({ navigation }) => {
  const { user, isManager } = useAuth();
  const { isTablet, isSmallScreen } = useResponsive();
  const insets = useSafeAreaInsets();
  const { data, loading, error, refetch } = useQuery(GET_MY_PORTFOLIOS);
  const [activeTab, setActiveTab] = useState('HOLDINGS');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'SYMBOL',
    order: 'ASC',
    filterBy: 'ALL',
    minValue: '',
    maxValue: '',
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  // Calculate aggregate portfolio summary
  const portfolioSummary = useMemo(() => {
    if (!data?.myPortfolios) return null;
    
    let totalInvested = 0;
    let totalCurrent = 0;
    let totalDayPL = 0;
    const allAssets = [];

    data.myPortfolios.forEach(portfolio => {
      portfolio.assets.forEach(asset => {
        // Simulate P&L for each asset (would come from real-time data in production)
        const percentageChange = (Math.random() - 0.3) * 0.5; // -30% to +20%
        const currentPrice = asset.price * (1 + percentageChange);
        const currentValue = asset.quantity * currentPrice;
        const investedValue = asset.value;
        const gainLoss = currentValue - investedValue;
        
        // Simulate daily P&L
        const dailyChange = (Math.random() - 0.5) * 0.05; // -5% to +5%
        const dayPL = investedValue * dailyChange;
        
        totalInvested += investedValue;
        totalCurrent += currentValue;
        totalDayPL += dayPL;
        
        allAssets.push({
          ...asset,
          portfolioId: portfolio.id,
          currentPrice,
          currentValue,
          gainLoss,
          percentageChange: (gainLoss / investedValue) * 100,
          dayPL,
          dayPLPercentage: dailyChange * 100,
          portfolioName: portfolio.name,
          isEvent: currentValue > investedValue * 1.1,
        });
      });
    });

    // Apply filters
    let filteredAssets = [...allAssets];

    // Filter by type
    if (filters.filterBy === 'GAINS') {
      filteredAssets = filteredAssets.filter(asset => asset.gainLoss > 0);
    } else if (filters.filterBy === 'LOSSES') {
      filteredAssets = filteredAssets.filter(asset => asset.gainLoss < 0);
    } else if (filters.filterBy === 'EVENTS') {
      filteredAssets = filteredAssets.filter(asset => asset.isEvent);
    }

    // Sort assets
    filteredAssets.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'SYMBOL':
          aValue = (a.symbol || a.name || '').toLowerCase();
          bValue = (b.symbol || b.name || '').toLowerCase();
          break;
        case 'QUANTITY':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'INVESTED':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'PNL':
          aValue = a.gainLoss;
          bValue = b.gainLoss;
          break;
        case 'PNL_PERCENT':
          aValue = a.percentageChange;
          bValue = b.percentageChange;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }
      
      if (filters.order === 'ASC') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return {
      totalInvested,
      totalCurrent,
      totalPL: totalCurrent - totalInvested,
      totalPLPercentage: ((totalCurrent - totalInvested) / totalInvested) * 100,
      totalDayPL,
      totalDayPLPercentage: (totalDayPL / totalInvested) * 100,
      allAssets: filteredAssets,
    };
  }, [data, filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      sortBy: 'SYMBOL',
      order: 'ASC',
      filterBy: 'ALL',
      minValue: '',
      maxValue: '',
    });
  };

  const renderAsset = ({ item }) => {
    const isPositive = item.gainLoss >= 0;
    const dayPLPositive = item.dayPL >= 0;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('PortfolioDetail', { portfolioId: item.portfolioId })}
        activeOpacity={0.7}
      >
        <View style={styles.assetRow}>
          <View style={styles.assetLeft}>
            <Text style={styles.assetQuantity}>
              Qty. {item.quantity} • Avg. {formatCurrency(item.price)}
            </Text>
            <Text style={styles.assetSymbol}>{item.symbol || item.name}</Text>
            <Text style={styles.assetInvested}>
              Invested {formatCurrency(item.value)}
              {item.currentValue > item.value * 1.1 && (
                <Text style={styles.eventTag}> EVENT</Text>
              )}
            </Text>
          </View>
          <View style={styles.assetRight}>
            <View style={styles.changeContainer}>
              <Text style={[
                styles.percentageChange,
                isPositive && styles.positiveText
              ]}>
                {isPositive ? '+' : ''}{item.percentageChange.toFixed(2)}%
              </Text>
              <Text style={[
                styles.absoluteChange,
                isPositive && styles.positiveText
              ]}>
                {formatCurrency(item.gainLoss)}
              </Text>
            </View>
            <Text style={styles.ltpText}>
              LTP {formatCurrency(item.currentPrice)}{' '}
              <Text style={[
                styles.dailyChange,
                dayPLPositive && styles.positiveText
              ]}>
                ({dayPLPositive ? '+' : ''}{item.dayPLPercentage.toFixed(2)}%)
              </Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
        <Text style={styles.errorText}>Error loading portfolios</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.headerTitle}>Portfolio</Text>
          <Text style={styles.headerSubtitle}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="cart-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="chevron-down" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {portfolioSummary && portfolioSummary.allAssets.length > 0 ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Portfolio Summary */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Invested</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(portfolioSummary.totalInvested)}
                </Text>
              </View>
              <View style={styles.summaryItemRight}>
                <Text style={styles.summaryLabel}>Current</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(portfolioSummary.totalCurrent)}
                </Text>
              </View>
            </View>
            <View style={styles.plRow}>
              <Text style={styles.plLabel}>P&L</Text>
              <Text style={[
                styles.plValue,
                portfolioSummary.totalPL >= 0 && styles.positiveText
              ]}>
                {portfolioSummary.totalPL >= 0 ? '+' : ''}{formatCurrency(portfolioSummary.totalPL)}
              </Text>
              <Text style={[
                styles.plPercentage,
                portfolioSummary.totalPL >= 0 && styles.positiveText
              ]}>
                {portfolioSummary.totalPL >= 0 ? '+' : ''}{portfolioSummary.totalPLPercentage.toFixed(2)}%
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabSection}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'HOLDINGS' && styles.activeTab]}
              onPress={() => setActiveTab('HOLDINGS')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'HOLDINGS' && styles.activeTabText
              ]}>
                Holdings
              </Text>
              {activeTab === 'HOLDINGS' && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>
                    {portfolioSummary.allAssets.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'POSITIONS' && styles.activeTab]}
              onPress={() => setActiveTab('POSITIONS')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'POSITIONS' && styles.activeTabText
              ]}>
                Positions
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filter Toolbar */}
          <View style={styles.filterToolbar}>
            <View style={styles.filterLeft}>
              <TouchableOpacity style={styles.filterIcon}>
                <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.filterIcon}
                onPress={() => setShowFilterDialog(true)}
              >
                <Ionicons name="filter-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterIcon}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.equityButton}>
                <Text style={styles.equityButtonText}>Equity</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.filterRight}>
              <TouchableOpacity style={styles.filterIcon}>
                <Ionicons name="people-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterIcon}>
                <Ionicons name="analytics-outline" size={20} color="#007AFF" />
              </TouchableOpacity>
              {(filters.filterBy !== 'ALL' || filters.sortBy !== 'SYMBOL') && (
                <TouchableOpacity 
                  style={styles.resetFilterButton}
                  onPress={handleResetFilters}
                >
                  <Ionicons name="close-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Holdings List */}
          <FlatList
            data={portfolioSummary.allAssets}
            renderItem={renderAsset}
            keyExtractor={(item) => `${item.portfolioId}-${item.id}`}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refetch} />
            }
          />

          {/* Day's P&L */}
          <View style={styles.daysPLContainer}>
            <Text style={styles.daysPLLabel}>Day's P&L</Text>
            <View style={styles.daysPLValues}>
              <Text style={[
                styles.daysPLValue,
                portfolioSummary.totalDayPL >= 0 && styles.positiveText
              ]}>
                {portfolioSummary.totalDayPL >= 0 ? '+' : ''}{formatCurrency(portfolioSummary.totalDayPL)}
              </Text>
              <Text style={[
                styles.daysPLPercentage,
                portfolioSummary.totalDayPL >= 0 && styles.positiveText
              ]}>
                {portfolioSummary.totalDayPL >= 0 ? '+' : ''}{portfolioSummary.totalDayPLPercentage.toFixed(2)}%
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No portfolios yet</Text>
          <Text style={styles.emptySubtext}>
            Create your first portfolio to get started
          </Text>
          <Button
            title="Create Portfolio"
            onPress={() => navigation.navigate('CreatePortfolio')}
            style={styles.emptyButton}
          />
        </View>
      )}

      {/* Filter Dialog */}
      <FilterDialog
        visible={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </View>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  summarySection: {
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  plRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  plLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 12,
  },
  plValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.error,
    marginRight: 8,
  },
  plPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  positiveText: {
    color: '#34C759',
  },
  tabSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  filterIcon: {
    padding: 4,
  },
  resetFilterButton: {
    padding: 4,
    marginLeft: 8,
  },
  equityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  equityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  assetLeft: {
    flex: 1,
  },
  assetQuantity: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  assetSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  assetInvested: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  eventTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  assetRight: {
    alignItems: 'flex-end',
  },
  changeContainer: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  percentageChange: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 2,
  },
  absoluteChange: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  ltpText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dailyChange: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
  },
  daysPLContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  daysPLLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  daysPLValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysPLValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginRight: 8,
  },
  daysPLPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    marginBottom: 16,
  },
});

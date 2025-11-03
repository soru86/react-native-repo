import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with comprehensive test data...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.videoFeedback.deleteMany();
  await prisma.video.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  // Create Coaches (Mentors)
  console.log('👨‍🏫 Creating coaches...');
  const coaches = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Carlos Martinez',
        email: 'carlos.martinez@coach.com',
        password,
        role: 'coach',
        bio: 'Professional soccer coach with 15+ years of experience. Former professional player and UEFA licensed coach. Specializes in technical development and tactical awareness.',
        specialties: JSON.stringify(['Technical Skills', 'Tactics', 'Ball Control', 'Shooting']),
        rating: 4.9,
        price: 75,
        totalSessions: 342,
        phone: '+1-555-0101',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@coach.com',
        password,
        role: 'coach',
        bio: 'Youth development specialist focusing on building confidence and fundamental skills. Experienced with players aged 8-18.',
        specialties: JSON.stringify(['Youth Development', 'Fundamentals', 'Confidence Building']),
        rating: 4.7,
        price: 60,
        totalSessions: 189,
        phone: '+1-555-0102',
        avatar: 'https://i.pravatar.cc/150?img=47',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Miguel Rodriguez',
        email: 'miguel.rodriguez@coach.com',
        password,
        role: 'coach',
        bio: 'Fitness and conditioning expert. Former fitness coach for professional teams. Focus on physical performance and injury prevention.',
        specialties: JSON.stringify(['Fitness', 'Conditioning', 'Injury Prevention', 'Agility']),
        rating: 4.8,
        price: 65,
        totalSessions: 267,
        phone: '+1-555-0103',
        avatar: 'https://i.pravatar.cc/150?img=33',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Emma Thompson',
        email: 'emma.thompson@coach.com',
        password,
        role: 'coach',
        bio: 'Goalkeeper specialist with professional playing experience. Expert in shot-stopping, positioning, and distribution.',
        specialties: JSON.stringify(['Goalkeeping', 'Shot-Stopping', 'Positioning', 'Distribution']),
        rating: 4.9,
        price: 70,
        totalSessions: 198,
        phone: '+1-555-0104',
        avatar: 'https://i.pravatar.cc/150?img=45',
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Kim',
        email: 'david.kim@coach.com',
        password,
        role: 'coach',
        bio: 'Defensive tactics expert. Focuses on positioning, teamwork, and defensive strategies for teams and individual players.',
        specialties: JSON.stringify(['Defense', 'Tactics', 'Positioning', 'Teamwork']),
        rating: 4.6,
        price: 55,
        totalSessions: 156,
        phone: '+1-555-0105',
        avatar: 'https://i.pravatar.cc/150?img=51',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@coach.com',
        password,
        role: 'coach',
        bio: 'Striker and finishing coach. Helps players improve their goal-scoring abilities through advanced finishing techniques.',
        specialties: JSON.stringify(['Finishing', 'Striking', 'Positioning', 'Composure']),
        rating: 4.8,
        price: 68,
        totalSessions: 221,
        phone: '+1-555-0106',
        avatar: 'https://i.pravatar.cc/150?img=32',
      },
    }),
  ]);

  console.log(`✅ Created ${coaches.length} coaches`);

  // Create Students
  console.log('👨‍🎓 Creating students...');
  const students = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alex Rivera',
        email: 'alex.rivera@student.com',
        password,
        role: 'student',
        bio: 'Aspiring professional player working on technical skills',
        phone: '+1-555-0201',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria Garcia',
        email: 'maria.garcia@student.com',
        password,
        role: 'student',
        bio: 'Youth player looking to improve fundamentals',
        phone: '+1-555-0202',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
    }),
    prisma.user.create({
      data: {
        name: 'James Wilson',
        email: 'james.wilson@student.com',
        password,
        role: 'student',
        bio: 'Goalkeeper working on shot-stopping and distribution',
        phone: '+1-555-0203',
        avatar: 'https://i.pravatar.cc/150?img=11',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sophie Chen',
        email: 'sophie.chen@student.com',
        password,
        role: 'student',
        bio: 'Focusing on fitness and conditioning',
        phone: '+1-555-0204',
        avatar: 'https://i.pravatar.cc/150?img=9',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Michael Brown',
        email: 'michael.brown@student.com',
        password,
        role: 'student',
        bio: 'Defender working on positioning and tactical awareness',
        phone: '+1-555-0205',
        avatar: 'https://i.pravatar.cc/150?img=15',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Olivia Davis',
        email: 'olivia.davis@student.com',
        password,
        role: 'student',
        bio: 'Striker looking to improve finishing and composure',
        phone: '+1-555-0206',
        avatar: 'https://i.pravatar.cc/150?img=20',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Noah Taylor',
        email: 'noah.taylor@student.com',
        password,
        role: 'student',
        bio: 'Midfielder working on passing and ball control',
        phone: '+1-555-0207',
        avatar: 'https://i.pravatar.cc/150?img=13',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Isabella Martinez',
        email: 'isabella.martinez@student.com',
        password,
        role: 'student',
        bio: 'Young player building fundamental skills',
        phone: '+1-555-0208',
        avatar: 'https://i.pravatar.cc/150?img=24',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ethan Lee',
        email: 'ethan.lee@student.com',
        password,
        role: 'student',
        bio: 'Advanced player preparing for trials',
        phone: '+1-555-0209',
        avatar: 'https://i.pravatar.cc/150?img=7',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ava White',
        email: 'ava.white@student.com',
        password,
        role: 'student',
        bio: 'Focusing on overall game improvement',
        phone: '+1-555-0210',
        avatar: 'https://i.pravatar.cc/150?img=28',
      },
    }),
  ]);

  console.log(`✅ Created ${students.length} students`);

  // Helper function to get dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const lastMonth = new Date(today);
  lastMonth.setDate(lastMonth.getDate() - 30);

  // Create Sessions
  console.log('📅 Creating sessions...');
  const sessions = [];

  // Upcoming confirmed individual sessions
  for (let i = 0; i < 5; i++) {
    const sessionDate = new Date(tomorrow);
    sessionDate.setDate(sessionDate.getDate() + i);
    sessions.push(
      await prisma.session.create({
        data: {
          mentorId: coaches[i % coaches.length].id,
          studentId: students[i % students.length].id,
          type: 'individual',
          date: sessionDate.toISOString().split('T')[0],
          time: `${10 + i}:00`,
          duration: 60,
          status: 'confirmed',
          price: coaches[i % coaches.length].price || 50,
        },
      })
    );
  }

  // Upcoming pending sessions
  for (let i = 0; i < 3; i++) {
    const sessionDate = new Date(nextWeek);
    sessionDate.setDate(sessionDate.getDate() + i);
    sessions.push(
      await prisma.session.create({
        data: {
          mentorId: coaches[(i + 2) % coaches.length].id,
          studentId: students[(i + 3) % students.length].id,
          type: 'individual',
          date: sessionDate.toISOString().split('T')[0],
          time: `${14 + i}:00`,
          duration: 90,
          status: 'pending',
          price: coaches[(i + 2) % coaches.length].price || 50,
        },
      })
    );
  }

  // Group sessions
  const groupSessions = [];
  for (let i = 0; i < 4; i++) {
    const sessionDate = new Date(tomorrow);
    sessionDate.setDate(sessionDate.getDate() + i + 2);
    const groupSession = await prisma.session.create({
      data: {
        mentorId: coaches[i % coaches.length].id,
        type: 'group',
        date: sessionDate.toISOString().split('T')[0],
        time: `${16 + i}:00`,
        duration: 90,
        status: 'confirmed',
        maxParticipants: 8,
        currentParticipants: 3 + i,
        price: (coaches[i % coaches.length].price || 50) * 0.7, // Group discount
      },
    });
    sessions.push(groupSession);
    groupSessions.push(groupSession);
  }

  // Completed sessions (past)
  for (let i = 0; i < 10; i++) {
    const sessionDate = new Date(lastWeek);
    sessionDate.setDate(sessionDate.getDate() - i);
    sessions.push(
      await prisma.session.create({
        data: {
          mentorId: coaches[i % coaches.length].id,
          studentId: students[i % students.length].id,
          type: 'individual',
          date: sessionDate.toISOString().split('T')[0],
          time: `${10 + (i % 8)}:00`,
          duration: 60,
          status: 'completed',
          price: coaches[i % coaches.length].price || 50,
        },
      })
    );
  }

  console.log(`✅ Created ${sessions.length} sessions`);

  // Create Videos
  console.log('🎥 Creating videos...');
  const videos = [];
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  
  for (let i = 0; i < 8; i++) {
    const student = students[i % students.length];
    const session = i < completedSessions.length ? completedSessions[i] : null;
    
    videos.push(
      await prisma.video.create({
        data: {
          userId: student.id,
          sessionId: session?.id || null,
          url: `https://example.com/videos/video-${i + 1}.mp4`,
          filename: `training-session-${i + 1}.mp4`,
          size: 5000000 + Math.floor(Math.random() * 5000000), // 5-10 MB
          duration: 120 + Math.floor(Math.random() * 180), // 2-5 minutes
        },
      })
    );
  }

  console.log(`✅ Created ${videos.length} videos`);

  // Create Video Feedback
  console.log('💬 Creating video feedback...');
  const feedbackMessages = [
    {
      rating: 4,
      comments: 'Great improvement in ball control! Your first touch has become much cleaner. Keep practicing dribbling drills.',
      improvements: ['Work on weaker foot', 'Improve acceleration', 'Better field awareness'],
    },
    {
      rating: 5,
      comments: 'Excellent performance! Your technique is spot on. The shooting accuracy has improved significantly.',
      improvements: ['Maintain consistency', 'Work on power shots'],
    },
    {
      rating: 4,
      comments: 'Good defensive positioning. You read the game well. Continue working on communication with teammates.',
      improvements: ['Improve passing range', 'Work on aerial duels'],
    },
    {
      rating: 3,
      comments: 'Solid foundation, but there\'s room for improvement in decision-making. Practice more game scenarios.',
      improvements: ['Speed of play', 'Better positioning', 'Work on confidence'],
    },
    {
      rating: 5,
      comments: 'Outstanding goalkeeping! Your reflexes and positioning are excellent. The distribution was very good.',
      improvements: ['Work on command of area', 'Improve long throws'],
    },
    {
      rating: 4,
      comments: 'Good fitness level and work rate. Keep pushing in training to build endurance.',
      improvements: ['Increase sprint speed', 'Work on recovery time'],
    },
  ];

  for (let i = 0; i < 6; i++) {
    if (videos[i]) {
      const feedback = feedbackMessages[i % feedbackMessages.length];
      await prisma.videoFeedback.create({
        data: {
          videoId: videos[i].id,
          coachId: coaches[i % coaches.length].id,
          rating: feedback.rating,
          comments: feedback.comments,
          improvements: JSON.stringify(feedback.improvements),
        },
      });
    }
  }

  console.log('✅ Created video feedback');

  // Create Payments
  console.log('💳 Creating payments...');
  const paymentSessions = sessions.filter((s) => s.status === 'confirmed' || s.status === 'completed');
  
  for (let i = 0; i < paymentSessions.length && i < 12; i++) {
    await prisma.payment.create({
      data: {
        userId: paymentSessions[i].studentId || students[0].id,
        sessionId: paymentSessions[i].id,
        amount: paymentSessions[i].price || 50,
        currency: 'USD',
        status: paymentSessions[i].status === 'completed' ? 'completed' : 'completed',
        paymentMethod: 'stripe',
        transactionId: `txn_${Date.now()}_${i}`,
      },
    });
  }

  console.log(`✅ Created ${Math.min(paymentSessions.length, 12)} payments`);

  // Summary
  console.log('\n✅ Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log(`   👨‍🏫 Coaches: ${coaches.length}`);
  console.log(`   👨‍🎓 Students: ${students.length}`);
  console.log(`   📅 Sessions: ${sessions.length}`);
  console.log(`   🎥 Videos: ${videos.length}`);
  console.log(`   💬 Feedback: 6`);
  console.log(`   💳 Payments: ${Math.min(paymentSessions.length, 12)}\n`);
  
  console.log('🔑 Login Credentials (all passwords: password123):');
  console.log('\n   Coaches:');
  coaches.forEach((coach, i) => {
    console.log(`   ${i + 1}. ${coach.name} - ${coach.email}`);
  });
  console.log('\n   Students:');
  students.slice(0, 5).forEach((student, i) => {
    console.log(`   ${i + 1}. ${student.name} - ${student.email}`);
  });
  console.log(`   ... and ${students.length - 5} more students\n`);
  
  console.log('💡 Test scenarios available:');
  console.log('   - Login with any user (password123)');
  console.log('   - View coaches/mentors with different specialties');
  console.log('   - Book individual and group sessions');
  console.log('   - View upcoming and past sessions');
  console.log('   - Upload videos and see feedback');
  console.log('   - Check payment history');
  console.log('   - Test coach dashboard with statistics\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

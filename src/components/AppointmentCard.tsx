import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, FileText, Stethoscope } from 'lucide-react-native';

export type Appointment = {
  id: string;
  name?: string;
  title?: string;
  date?: string;
  time?: string;
  active?: boolean;
  [key: string]: any;
};

const formatStatus = (status: string) =>
  (status || 'REQUEST_PLACED').replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const toStatusKind = (status: string) => {
  const s = (status || '').toUpperCase();
  if (s.includes('COMPLETED')) return 'completed';
  if (s.includes('ONGOING') || s.includes('IN_PROGRESS') || s.includes('ACCEPTED')) return 'in-progress';
  return 'pending';
};

export function AppointmentCard({
  item,
  type,
  requestType,
}: {
  item: any;
  type: 'consultation' | 'review';
  requestType: string;
}) {
  const navigation = useNavigation<any>();

  const isReview = type === 'review';
  const rawStatus = item.requestStatus || item.status || 'REQUEST_PLACED';
  const statusKind = toStatusKind(rawStatus);
  const statusBg = statusKind === 'pending' ? 'bg-orange-50' : statusKind === 'completed' ? 'bg-emerald-50' : 'bg-emerald-50';
  const statusText = statusKind === 'pending' ? 'text-orange-400' : statusKind === 'completed' ? 'text-emerald-500' : 'text-emerald-600';
  const patientName =
    `${item?.patient?.firstName || item?.firstName || ''} ${item?.patient?.lastName || item?.lastName || ''}`.trim() || 'Patient';
  const specialty = item.requestedDoctorType || 'General';
  const date = item.createdAt ? item.createdAt.split('T')[0] : item.date || '';

  const openDetails = () => {
    if (isReview) {
      navigation.navigate('review_main_result_screen', { id: item.id, requestType });
    } else {
      navigation.navigate('doctor_request_screen', { id: item.id, requestType });
    }
  };

  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-2xl mb-4 mx-4 border border-gray-100 flex-row items-center"
      onPress={openDetails}
      activeOpacity={0.85}
    >
      <View className={`p-3 rounded-xl mr-4 ${isReview ? 'bg-emerald-50' : 'bg-emerald-50'}`}>
        {isReview ? <FileText size={22} color="#059669" /> : <Stethoscope size={22} color="#059669" />}
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-start">
          <View className="pr-3 flex-1">
            <Text className="font-bold text-slate-800 text-base" numberOfLines={1}>
              {patientName}
            </Text>
            <Text className="text-gray-500 text-sm" numberOfLines={1}>
              {isReview ? 'Lab Result Review' : 'Doctor Consultation'} · {specialty}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">{date}</Text>
          </View>
          <View className="items-end">
            <View className={`px-3 py-1 rounded-full mb-2 ${statusBg}`}>
              <Text className={`text-[10px] font-bold ${statusText}`}>{formatStatus(rawStatus)}</Text>
            </View>
            <ChevronRight size={16} color="#cbd5e1" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}


export type Appointment = {
  id: string;
  name: string;
  title: string;
  date: string;
  time: string;
  active?: boolean;
}; 
// 

export function AppointmentCard({ item, type, requestType }: { item: Appointment, type: 'consultation' | 'review', requestType: 'queueOnly' | 'acceptedOnly' }) {
// +item?.patient?.firstName|| item.firstName
  console.log('AppointmentCard rendered with item: ', item);
  const navigation = useNavigation();
  return (
    <View style={[styles.card, item.active && styles.cardActive]}> 
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require('../../assets/images/icon.png')} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          {/* <Text style={styles.title}>{item.title}</Text> */}
          <Text style={styles.name}>{item?.patient?.lastName || item.lastName+' '}</Text>
          <Text style={styles.meta}>{item.createdAt.split('T')[0]} {item.time}</Text>
          {/* <Text style={styles.meta}>Duration: {item.requestedDuration}</Text> */}
        </View>
        {/* <View style={styles.cta}
        onMagicTap={() => console.log('View details tapped')}
        ><Text style={styles.ctaText}>View details</Text></View> */}

<TouchableOpacity style={styles.cta}
      onPress={() => {
       type === 'consultation' ? navigation.navigate('doctor_request_screen', {id:item.id, requestType:requestType}) : navigation.navigate('review_main_result_screen', {id:item.id, requestType:requestType});
         console.log('View details tapped ', item.id);
      }}
      >
        <Text style={styles.ctaText}>View details</Text>
      </TouchableOpacity>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F6F8FB',
    borderRadius: 16,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  cardActive: {
    backgroundColor: '#E6F5F1',
    borderColor: '#C7EEE4',
    borderWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  title: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  name: {
    ...typography.body,
    fontWeight: '500',
  },
  meta: {
    ...typography.sub,
    marginTop: 2,
  },
  cta: {
    backgroundColor: '#0C1B3A',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  }
});

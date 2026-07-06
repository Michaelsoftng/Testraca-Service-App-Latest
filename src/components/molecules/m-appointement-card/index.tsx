import React, {useState} from 'react';
import {View, StyleSheet, Image, Text, Pressable} from 'react-native';
import MapSvg from '../../../assets/images/svg/map';
import ClockSvg from '../../../assets/images/svg/clock';
import {useDispatch} from 'react-redux';
import {
  patientUserService,
  setPatientUser,
} from '../../../store/slices/patientsDesSlice';
import {GetListPhlebotomistTestAssignmentsQuery} from '../../../lib/types/generated/graphql';
import {appColors} from '../../../lib/utils/scale';
import {formatDate} from '../../../lib/utils/functions';
interface AppointmentHeaderProps {
  profilePic: string | null;
  name: string;
  location?: string | null;
}

const AppointmentHeader = ({
  profilePic,
  name,
  // time,
  location,
}: // distance,
AppointmentHeaderProps) => (
  <View style={styles.headerContainer}>
    <View style={styles.imageAndNameStyle}>
      <Image
        resizeMode="contain"
        source={{
          uri: profilePic
            ? profilePic
            : `https://ui-avatars.com/api/?name=${name}+${name}&background=random&length=2&rounded=true&size=70`,
        }}
        style={styles.profilePic}
      />
      <View style={styles.headerTextContainer}>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>
    </View>

    <View style={styles.infoContainer}></View>
  </View>
);

interface TestDetailProps {
  title: string;
  price: string;
}

const TestDetail = ({title, price}: TestDetailProps) => (
  <View style={styles.serviceContainer}>
    <Text style={styles.serviceTitle}>{title}</Text>
    <View style={styles.packageContainer}>
      <View style={styles.packageContainerInner}>
        <Text style={styles.packageType}>Price</Text>
        <Text style={styles.price}>
          {Number(price)?.toLocaleString('en-NG', {
            style: 'currency',
            currency: 'NGN',
          })}
        </Text>
      </View>
    </View>
  </View>
);

const AcceptButton = ({
  onStatusChangeLoading,
  title = 'Accept Request',
}: {
  onStatusChangeLoading: boolean;
  title?: string;
}) => (
  <View style={styles.acceptButtonContainer}>
    <Text style={styles.acceptButtonText}>
      {onStatusChangeLoading && 'Loading...'}
      {!onStatusChangeLoading && title}
    </Text>
  </View>
);

type SelectionType = NonNullable<
  NonNullable<
    NonNullable<
      GetListPhlebotomistTestAssignmentsQuery['listPhlebotomistTestAssignments']
    >['0']
  >
>;

interface AppointmentCardProps {
  navigation: any;
  onStatusChangeLoading: boolean;
  items: SelectionType | null;
  index?: number;
  btnText?: string;
  withBtn?: boolean;
  selectUser?: boolean;
  handleChangeStatus: (id: string) => void;
  handleChangeStatusCancel?: (id: string) => void;
}

const AppointmentCard = ({
  navigation,
  onStatusChangeLoading,
  handleChangeStatusCancel,
  items,
  btnText,
  selectUser = true,
  withBtn = true,
  index,
  handleChangeStatus,
}: AppointmentCardProps) => {
  const imageData = null;
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const reduxDispatch = useDispatch();

  const handleSelect = (_item: AppointmentCardProps['items']) => {
    setLoading(true);
    const geolocationUrl = _item?.request?.patient.geolocation;
    let latitude = null;
    let longitude = null;

    if (
      geolocationUrl &&
      geolocationUrl.startsWith('https://maps.google.com/?q=')
    ) {
      const coordinates = geolocationUrl.split('?q=')[1].split(',');
      const parsedLatitude = parseFloat(coordinates[0]);
      const parsedLongitude = parseFloat(coordinates[1]);

      // Check if parsedLatitude and parsedLongitude are valid numbers
      if (!isNaN(parsedLatitude) && !isNaN(parsedLongitude)) {
        latitude = parsedLatitude;
        longitude = parsedLongitude;
      }
    }
    if (selectUser) {
      reduxDispatch(
        setPatientUser({
          id: _item?.request?.id!,
          req_id: Number(_item?.pk)!,
          firstName: _item?.request?.patient?.user?.firstName!,
          lastName: _item?.request?.patient?.user?.lastName!,
          photo: imageData,
          request: {
            testDate: formatDate(_item?.request?.testDate),
            notes: _item?.request?.notes,
            requestedAt: formatDate(_item?.request?.requestedAt),
            completedAt: _item?.request?.completedAt,
            cancelledAt: _item?.request?.cancelledAt,
            address: _item?.request?.address,
            total: _item?.request?.total,
          },
          // time: 6,
          location: {
            locationName: _item?.request?.patient?.address!,
            latitude,
            longitude,
          },
          distance: '2.4km',
          service: _item?.request?.labTest?.edges?.map((item, i) => ({
            title: item?.node?.name!,
            // packageType: 'Single, 1 person',
            price: item?.node?.price?.toString() ?? '',
          })) as unknown as patientUserService[],
        }),
      );
    }

    if (handleChangeStatus) {
      handleChangeStatus(_item?.pk!);
    }
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const toggleShow = () => {
    setShow(!show);
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <AppointmentHeader
          profilePic={imageData}
          name={`${items?.request?.patient?.user?.firstName} ${items?.request?.patient?.user?.lastName}`}
          // time={{icon: 'https://example.com/time-icon.jpg', text: '06:00 AM'}}
          location={items?.request?.address}
          // distance={{
          //   icon: 'https://example.com/distance-icon.jpg',
          //   text: '2.4km',
          // }}
        />
        <View
          style={{
            width: '100%',
            height: 0.4,
            backgroundColor: 'transparent',
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: 'black',
          }}
        />
        <View style={styles.cardContainer}>
          <View style={styles.cardRow}>
            <Text style={styles.cardItemTitle}>Date </Text>
            <Text style={styles.cardItemValue}>
              {formatDate(items?.request?.testDate)}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardItemTitle}>Total</Text>
            <Text style={styles.cardItemValue}>
              {Number(items?.request?.total?.toString()!)?.toLocaleString(
                'en-NG',
                {
                  style: 'currency',
                  currency: 'NGN',
                },
              )}
            </Text>
          </View>
        </View>

        {show &&
          items?.request?.labTest?.edges?.map((item, i) => (
            <TestDetail
              key={i}
              title={item?.node?.name!}
              price={item?.node?.price?.toString()!}
            />
          ))}
        {withBtn && (
          <Pressable onPress={() => handleSelect(items)}>
            <AcceptButton onStatusChangeLoading={loading} title={btnText} />
          </Pressable>
        )}
      </View>
      <View style={styles.containerFooter}>
        {withBtn ? (
          <Pressable
            onPress={() =>
              handleChangeStatusCancel && handleChangeStatusCancel(items?.pk!)
            }>
            <Text style={{color: appColors.error}}>Cancel Request</Text>
          </Pressable>
        ) : (
          <View />
        )}

        <Pressable onPress={() => toggleShow()}>
          {show ? (
            <Text style={{color: appColors.primaryGreen}}>Hide Details</Text>
          ) : (
            <Text style={{color: appColors.primaryGreen}}>Show</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  containerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
  },
  imageAndNameStyle: {
    flexDirection: 'row',
  },
  card: {
    borderRadius: 8,
    borderColor: '#E2E4E8',
    borderWidth: 1,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 5,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
  },
  headerTextContainer: {
    justifyContent: 'space-between',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#525C76',
    paddingLeft: 3,
  },

  location: {
    fontSize: 14,
    color: '#525C76',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  distanceText: {
    fontSize: 14,
    paddingLeft: 3,
  },
  serviceContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F5F6F7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E4E8',
  },
  serviceTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  packageContainer: {
    marginTop: 12,
  },
  packageContainerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
  },

  packageType: {
    color: '#525C76',
    fontWeight: '500',
  },
  packageTypeText: {
    color: '#fff',
    fontWeight: '500',
  },
  packageTypeContainer: {
    backgroundColor: '#0F1D40',
    padding: 4,
    borderRadius: 3,
  },
  price: {
    fontWeight: '600',
    color: '#0F1D40',
  },
  acceptButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#059669',
    marginTop: 12,
    padding: 8,
    borderRadius: 3,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cardContainer: {
    margin: 10, // Add margin if needed
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Add space between rows
  },
  cardItemTitle: {
    fontWeight: 'bold',
    fontSize: 16, // Adjust the size as needed
  },
  cardItemValue: {
    fontWeight: 'bold',
    fontSize: 16, // Adjust the size as needed
  },
});

export default AppointmentCard;

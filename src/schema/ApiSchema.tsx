import { gql } from '@apollo/client';

export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    TokenAuth(email: $email, password: $password) {
      success,
    errors,
    token,
    refreshToken,
    unarchiving,
    user {
      id,
      userType
    }      
    }
  }`;





export const VERIFY_TOKEN_MUTATION = gql`
mutation VerifyToken($accessToken: String!) {
  verifyToken(token: $accessToken) {
    payload
  }
}`;

export const GET_ONE_PATIENT_BY_ID = `
query getOnePatientById($id: String!) {
  getOnePatientById(id: $id) {
    firstName
    lastName
    email
    id
    phoneNumber
  }
}`;

export const GET_ALL_FACILITIES_BY_TEST =`
query getAllFacilitiesByTest($testId: String!) {
  getAllFacilitiesByTest(testId: $testId) {
    id
    name
    code
    testType
    group
    description
  }
}`;

export const GET_ALL_TESTS_BY_FACILITY = `
query getAllTestsByFacility($facilityId: String!) {
  getAllTestsByFacility(facilityId: $facilityId) {
    testsCount
    tests{
        id
        name
        code
        description
    }   
  }
}`;

export const CREATE_TEST_UPLOAD = gql`mutation CreateTestUpload(
    $file: String!, 
    ) {
CreateTestUpload(
file: $file, 
) {
testsSkipped {
    name
    code
    id
}
testsCreated {
    name
    code
    id
}
}
}`;

export const GET_TEST_BY_ID = `
query getTestById($id: String!) {
    getTestById(id: $id) {
      id
      name
      code
      testType
      group
      description
    }
  }
  `;

  export const GET_ALL_TEST = `
  query getAllTest($limit: Int, $offset: Int){
    getAllTest(limit: $limit, offset: $offset) {
      id
      name
      code
      testType
      group
      description
    }
  }
  `;

  export const GET_TEST_BY_CODE = `
  query getTestByCode($code: String!) {
    getTestByCode(code: $code) {
      id
      name
      code
      testType
      group
      description
    }
  }
  `;

  export const UPDATE_TEST =gql`
  mutation UpdateTest(
        $testcode: String, 
        $testId: String,
		$updateData: UpdateDataInput!
		) {
  UpdateTest(
    id:$testId,
    testcode: $testcode,
	updateData: $updateData
    ) {
    test {
      id
      name
      code
      testType
      group
    }
}
}`;

export const CREATE_TEST_PACKAGE = gql`
mutation CreateTestPackage(
		$test: String!, 
		$package: String! 
		) {
  CreateTestPackage(
	test: $test, 
    package: $package
  ) {
    testPackage {
      id
      test{
        id
        name
        code
        description
      }
      package{
        id
        packageName
        facilityType
      }
    
    }
}
}`;


export const DELETE_TEST_PACKAGE = gql`
mutation DeleteTestPackage(
	    $test: String!, 
		$package: String!  
	) {
  DeleteTestPackage(
	test: $test, 
    package: $package
	) {
    test {
      deletedStatus
      message
    }
}
}`;


export const UPDATE_USER = gql`
mutation UpdateUser($userId: String, $updateData: UpdateUserDataInput!) {
  UpdateUser(userId: $userId, updateData:$updateData
  ) {
    user {
      id
      firstName
      lastName
      email
      streetAddress
      city
      state
      country 
      postal
      #latitude
      ##longitude
      patient{
        dateOfBirth
        id
      }
    }

  }
}`;


export const NEW_USER_PHLEB = `mutation CreateUser($email: String!, $phone_number: String!, $password: String!, $user_type: String!, $firstName: String!, $lastName: String!) {
                CreateUser(email: $email, password: $password, 
                  phoneNumber: $phone_number, userType: $user_type, firstName: $firstName, lastName:$lastName
                ) {
                  user {
                    id
                    email
                    phoneNumber
                    phlebotomist{
                      id        
                      # dateOfBirth
                    }
                  }
                  # user {
                  #   id
                  #   email
                  #   phoneNumber
                  #   patient{
                  #     id
                  #   }
                  # }
                  accessToken
                  refreshToken
                }
              }`;

export const NEW_USER_DOCTOR = `mutation CreateUser($email: String!, $phone_number: String!, $password: String!, $user_type: String!, $firstName: String!, $lastName: String!, $specialization: String) {
  CreateUser(email: $email, password: $password, 
    phoneNumber: $phone_number, userType: $user_type, firstName: $firstName, lastName:$lastName, specialization: $specialization
  ) {
    user {
      id
      email
      phoneNumber
      doctor{
        id        
        # dateOfBirth
      }
    }
    # user {
    #   id
    #   email
    #   phoneNumber
    #   patient{
    #     id
    #   }
    # }
    accessToken
    refreshToken
  }
}`;

export const VERRIFY_ACCOUNT_WITH_OTP=gql`
mutation VerifyAccount($user: String!, $token: Int!) {
  VerifyUserAccount(user: $user, token: $token) {
    success {
      message
      code
    }
    errors {
      message
      code
    }
    user {
      id,
      userType
    }
  }
}`;

export const RESEND_CODE =gql`
mutation ResendVerificationCode($user: ID!) {
  ResendVerificationCode(user: $user) {
    success {
      message
      code
    }
    errors {
      message
      code
    }
    user {
      id,
      userType
    }
  }
}`;

export const GET_USER_BY_ID_EMAIL = `
query getUserByEmail($email: String!) {
  getUserByEmail(email: $email) {
    firstName
    lastName
    email
    id
    phoneNumber
    approvalToken
    staff{
        id        
    }
    patient{
        dateOfBirth
        id
      }
      organisation{
        id
        organisation_name
    }
    Phlebotomist{
        id 
        dob
    }
  }
}`;


export const GET_ALL_FACILITIES_BY_TEST_AND_LOCATION = `query getAllFacilitiesByTestAndLocation($testId: String!, $#latitude: CustomDecimal!, $##longitude: CustomDecimal!, 
) {
  getAllFacilitiesByTestAndLocation(testId: $testId, #latitude: $#latitude, ##longitude: $##longitude ) {
        facilityTestCount
        facilityTests{

      
            test{
                id
                name
                code

            }
            price
            preparation
            duration
            distance
            facility{
                id  
                facilityName
                facilityType
                
                user{
                    id
                    email
                    phoneNumber
                }
            }
        
        }
   
  }
}
`;

export const CREATE_REQUEST = `mutation CreateRequest(
    $patient: String!,
    $sampleCollectionDate: String!,
    $samplePickupAddress: String! ,
    $samplePickup#latitude: CustomDecimal!
    $samplepickup##longitude: CustomDecimal!,
    $total: Float!,
    $tests: [CreateRequestTestDataInput]!
    ){
    CreateRequest(
        patient: $patient,
        sampleCollectionDate: $sampleCollectionDate,
        samplePickUpAddress:  $samplePickupAddress,
        samplePickup#latitude:$samplePickup#latitude,
        samplePickup##longitude: $samplepickup##longitude,
        tests:$tests,
        total:$total
        ){
        request{
            id            
            samplePickUpAddress
            requestDate
            sampleCollectionDate
            samepleDropOffDate
            requestStatus
            total
            patient{
                id
                user{
                   firstName  
                   lastName
                   email

                }
            }
            tests{
                id
                name
                code
            }
        }

    } 
        }`;

export const GETREQUEST = `query getAllRequests(
  $limit: Int!
  $offset: Int!
  $requestStatus: String
  $searchTerm: String
  $patientId: ID
  $phlebotomistId: ID
  $queueOnly: Boolean
) {
  getAllRequests(
    limit: $limit
    offset: $offset
    requestStatus: $requestStatus
    searchTerm: $searchTerm
    patientId: $patientId
    phlebotomistId: $phlebotomistId
    queueOnly: $queueOnly
  ) {
    requestsCount
    requests {
      id
      sampleCollectionDate
      samepleDropOffDate
      requestStatus
      isPaid
      pickupDistance
      dropOffDistance
      phlebotomistEarning
      labtracaProfit
      hasPhlebotomistBeenPaid
      requestDate
      samplePickUpAddress
      balance
      coveredAmount
      total
      totalPaymentSum
      testRequestCount
      requestProfitMargin
      logisticsEstimate
      distanceCharge
      patient {
        id
        origin
      }
      phlebotomist {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      testRequests {
        patientName
        patientAge
        status
        facilityDistance
        result {
          id
          generatedPdfUrl
        }
        test {
          id
          name
          code
          price
        }
        facility {
          id
          facilityName
          facilityType
          rating
          streetAddress
          streetAddress2
          city
          state
          country
          postal
          latitude
          longitude
        }
      }
    }
  }
}`;
// export const GETREQUEST = `query getRequest($id: ID, $patienId: ID,){
//         getRequest(id: $id, patienId: $patienId){
//             id
//             requestStatus
//             isPaid
//             balance
//             patient{
//                 id
//                 user{
//                    firstName  
//                    lastName
//                    email

//                 }
//             }
//             tests{
//                 id
//                 name
//                 code
//             }
         
//             payment{
//                 id
//                 amountPaid
//                 amountCharged
//             }
//         }

// }`;



        

export const GET_CHARGES = `
query getCharges{
    getCharges{
        serviceCharge
        chargePerDistance
        consultationCharge
        consultationDiscount
        partPayment
        doctorsPercentage
        phlebotomistPercentage
        budgetPerDistance
        referralBonusPercentage
        baseCharge
        lastChangedBy{
            id
            user{
                id
                email
                firstName
                lastName
            }
        }
        admin{
            id
            user{
                id
                email
            }       
        }
    }
}
# query getCharges{
#     getCharges{
#         phlebotomistPercentage
#         serviceCharge
#         chargePerDistance        
#         doctorsPercentage
        
#     }
# }`;


export const CREATE_PAYMENT = gql`
mutation CreatePayment(
  $paidby: ID!,
  $paidTo: ID!,
  $paidFor: String!,
  $paymentPlan: String!,
  $paymentType: String!,
  $amount: Float!,
  $paymentChannel: String!,
  $paymentId: String!,
  $paymentDetails: String,
  $description: String,
  $requestId: String
) {
  CreatePayment(
    paidby: $paidby,
    paidTo: $paidTo,
    paidFor: $paidFor,
    paymentPlan: $paymentPlan,
    paymentType: $paymentType,
    amount: $amount,
    paymentChannel: $paymentChannel,
    paymentId: $paymentId,
    paymentDetails: $paymentDetails,
    description: $description,
    requestId: $requestId
  ) {
    paidby
    paidTo
    paidFor
    paymentPlan
    paymentType
    amount
    paymentChannel
    paymentId
    paymentDetails
    description
    requestId
  }
}`;



export const GET_USER_BY_ID_ADMIN = `
query getUserById($id: String!) {
  getUserById(id: $id) {
    firstName
    lastName
    email
    id
    phoneNumber
    streetAddress
    streetAddress2
    city
    state
    country 
    postal
    ##latitude
    ###longitude
    approvalToken
    ###longitude
    ##latitude
    location
    postal
    country
    state
    city
    location
     doctor{
        id
        bankInformation
        online
        uniqueId
        specialization
    }
    phlebotomist{        
        id
        dob
        online
        bankInformation
        phlebotomistEarning
        uniqueId
        
        # dateOfBirth

      }
 #doctor{
  #      id
   #     online
    #    bankInformation
        
        
     # }
  }
}`;


export const GET_USER_BY_ID_ADMIN_1 = gql`query getUserById($id: String!) {
    getUserById(id: $id) {
      firstName
      lastName
      email
      id
      phoneNumber
      streetAddress
      streetAddress2
      city
      state
      country 
      postal
      location   
      # latitude
      # longitude
      approvalToken
      # longitude
      # latitude
      postal
      country
      state
      city
      userType
      location
      referralCode
      referralBonus
      userWallet{
        id
        amount
    }
      organisation{
          id
          noOfEmployees
          organisationName
          organisationType
          testChoice
          
      }
     # doctor{
      #    id
       #   bankInformation
        #  online
          
      #}
      phlebotomist{        
          id
          dob
          online
          bankInformation
          phlebotomistEarning
          uniqueId
          
          # dateOfBirth
  
        }

    doctor{
        id
        bankInformation
        online
        uniqueId
        specialization
    }
    
        patient{        
          id
          organisationName
          organisationType
          patientType
          noOfEmployees        
          dateOfBirth
          testChoice
          location{
              id
              name
          }
        }
   
    }
  }`;

// `
// query getUserById($id: String!) {
//   getUserById(id: $id) {
//     firstName
//     lastName
//     email
//     id
//     phoneNumber
//     streetAddress
//     streetAddress2
//     city
//     state
//     country 
//     postal
//     ##latitude
//     ###longitude
//     approvalToken
//     ###longitude
//     ##latitude
//     ##location
//     postal
//     country
//     state
//     city
//     location
//      doctor{
//         id
//         bankInformation
//         online
        
//     }
//     phlebotomist{        
//         id
//         dob
//         online
//         bankInformation
//         phlebotomistEarning
        
//         # dateOfBirth

//       }
//  doctor{
//         id
//         online
//         bankInformation
//         specialization
        
//       }
//   }
// }`;




export  const CREATE_PHLEBOTOMIST = `mutation CreateUser($email: String!, $phone_number: String!, $password: String!, $user_type: String!, $firstName: String!, $lastName: String!) {
  CreateUser(email: $email, password: $password, 
    phoneNumber: $phone_number, userType: $user_type, firstName: $firstName, lastName:$lastName
  ) {
    user {
      id
      email
      phoneNumber
      phlebotomist{
        id        
        # dateOfBirth
      }
    }
    # user {
    #   id
    #   email
    #   phoneNumber
    #   patient{
    #     id
    #   }
    # }
    accessToken
    refreshToken
  }
}`;




export const GET_ALL_REQUEST_ASSIGNMENT =`query getAllAssignmentForUser($userId: ID!){
    getAllAssignmentForUser(userId: $userId){
        id
        isAccepted
        potentialEarning
        assignedBy{
                id
                staff{
                    id
                }
            }
            assigned{
                id
                doctor{
                    id
                }
                phlebotomist{
                    id
                }
            }
            assignmentDate
            lastAssignmentTime
            taskObjectId
    }
}`;

export const GETREQUESTBYID = `query getRequest($id: ID!) {
  getRequest(id: $id) {
    id
    sampleCollectionDate
    samepleDropOffDate
    requestStatus
    isPaid
    pickupDistance
    dropOffDistance
    phlebotomistEarning
    labtracaProfit
    hasPhlebotomistBeenPaid
    requestDate
    samplePickUpAddress
    balance
    coveredAmount
    total
    totalPaymentSum
    testRequestCount
    requestProfitMargin
    logisticsEstimate
    distanceCharge
    patient {
      id
      origin
      firstName
      lastName
      phoneNumber
      email
    }
    phlebotomist {
      id
      firstName
      lastName
      email
      phoneNumber
    }
    requestId {
      id
      patientAge
      patientName
      gender
      status
    }
    requestedByProfessional {
        id
        firstName
        lastName
        email
        phoneNumber
        userType
        origin
    }
    testRequests {
      patientName
      patientAge
      status
      facilityDistance
      result {
        id
        generatedPdfUrl
      }
      test {
        id
        name
        code
        price
      }
      facility {
        id
        facilityName
        facilityType
        rating
      }
    }
  }
}`;

export const GET_PERSON_REQUEST_DETAILS =`query getRequest($id: ID, $patienId: ID,){
        getRequest(id: $id, patienId: $patienId){
            id
            sampleCollectionDate
            samepleDropOffDate
            requestStatus
            isPaid
            balance
            pickupDistance
            dropOffDistance   
            phlebotomistEarning     
            labtracaProfit    
            hasPhlebotomistBeenPaid            
            patient{
                id
                requestPatient{
                    id
                    requestDate
                    
                }
                user{
                   firstName  
                   lastName
                   email
                    city
                    country
                    streetAddress
                    streetAddress2
                    phoneNumber
                    state
                }
            }
            phlebotomist{
                id  
                      
                user{
                    id
                    firstName
                    lastName
                    email
                    phoneNumber
                }
            }
            
            tests{
                id
                name
                code            
                requestedtest{
                    id

                    facility{
                        id
                        facilityName
                        
                    }
                }   
            }  
            testRequest{
                # requestedtest
                patientName
                patientAge
                status
                facilityDistance
            }          
           
            payment{
                id
                amountPaid
                amountCharged
                invoice
                paidFor
                createdAt
                referrence
                paymentPlan
                paymentType
                invoice
                description
                verifiedAt
                
            } 
            # 448d7433-22e7-46bc-ad06-bf4d373d56d8
        }

}`;
export const UPDATE_PHLEBO_USER = `mutation UpdateUser($userId: String!, $updateData: UpdateUserDataInput!) {
  UpdateUser(userId: $userId, updateData:$updateData
  ) {
    user {
      id
      firstName
      lastName
      email
      streetAddress
      city
      state
      country 
      postal
     # #latitude
     # ##longitude
    #   patient{
    #     dateOfBirth
    #     id
    #   }

    # organisation{
    #     id
    #     organisation_name
    # }

    # Phlebotomist{
    #     id 
    #     dob
    # }
    phlebotomist{        
        id
        dob
        online
        bankInformation
        
        # dateOfBirth

      }
    }

  }
}`;
export const UPDATE_PHLEBO_DOC = `mutation UpdateUser($userId: String, $updateData: UpdateUserDataInput!) {
  UpdateUser(userId: $userId, updateData:$updateData
  ) {
    user {
      id
      firstName
      lastName
      email
      streetAddress
      city
      state
      country 
      postal
      location
    #  #latitude
    #  ##longitude
    #   patient{
    #     dateOfBirth
    #     id
    #   }

    # organisation{
    #     id
    #     organisation_name
    # }

    # Phlebotomist{
    #     id 
    #     dob
    # }
  doctor{
        id
        bankInformation
        online
        
    }
    
    }

  }
}`;

export const ACCEPT_ASSIGNMENT =`mutation AcceptAssignment($assigmentId:ID!, $assigned: ID!, $isAccepted:Boolean!){
    AcceptAssignment(assigned:$assigned,
    assignmentId: $assigmentId,
    isAccepted: $isAccepted){
        # success{
        #     code
        #     message
        # }
        # error{
        #     message
        #     code
        # }
        assignment{
            assignedBy{
                id
                staff{
                    id
                }
            }
            assigned{
                id
                doctor{
                    id
                }
                phlebotomist{
                    id
                }
            }
            assignmentDate
            lastAssignmentTime
            taskObjectId
        }
    }
}`;

export const ACCEPT_ASSIGNMENT_NEW = `mutation AcceptRequest(
    $requestId: UUID!,
    #$phlebotomistId: UUID!
    ){
    AcceptRequest(
        requestId: $requestId,
        #phlebotomistId: $phlebotomistId
        ){
        request{
            id
            dropOffDistance
            samplePickUpAddress
            requestDate
            sampleCollectionDate
            samepleDropOffDate
            requestStatus
            total
            phlebotomist{
                id
        

            }
            patient{
                id
         
            }

            
        }

    }

}

`; 
export const CANCEL_REQUEST = `mutation CancelRequest($requestId: String!){
    CancelRequest(requestId: $requestId){
        # consultation
        request
    }
}`;

export const BANK_LIST = `query getBanks{
    getBanks{
        name
        slug
        code
        longcode
        gateway
        payWithBank
        active
        isDeleted
        country
        currency
        type
        id
        createdAt
        updatedAt
    }
}`;

export const GET_MY_WALLET_BALANCE = `query GetMyWalletBalance {
  getMyWalletBalance
}`;

export const VERIFY_ACCOUNT_NUMBER = `query VerifyAccount($accountNumber: String!, $bankCode: String!) {
  verifyAccountNumber(accountNumber: $accountNumber, bankCode: $bankCode) {
    status
    accountName
    accountNumber
    message
  }
}`;

export const CREATE_PAYOUT = `mutation Withdraw(
  $amount: Float!
  $accountNumber: String!
  $accountName: String!
  $bankCode: String!
  $bankName: String!
  $description: String
) {
  createPayout(
    amount: $amount
    accountNumber: $accountNumber
    accountName: $accountName
    bankCode: $bankCode
    bankName: $bankName
    description: $description
  ) {
    status
    message
    payout {
      id
      amountRequested
      amountPaid
      status
      reference
      accountName
      bankName
      description
      createdAt
    }
  }
}`;

export const MY_PAYOUTS = `query MyPayouts($limit: Int!, $offset: Int!, $status: String) {
  getMyPayouts(limit: $limit, offset: $offset, status: $status) {
    payoutsCount
    payouts {
      id
      amountRequested
      amountPaid
      status
      accountName
      bankName
      reference
      description
      createdAt
    }
  }
}`;

export const CHANGE_PASSWORD =`mutation ChangeUserPassword(
    $old_password: String!, 
    $new_password1: String!, 
    $new_password2: String!) {
  ChangeUserPassword(
    oldPassword: $old_password, 
    newPassword1: $new_password1, 
    newPassword2: $new_password2) {
    
    success
    errors
  }
}`;

export const UPDATE_SAMPLEDROPDATE = `mutation UpdateRequest($requestId: String!, $updateData: UpdateRequestDataInput!) {
  UpdateRequest(requestId: $requestId, updateData:$updateData
  ) {
    request{
        requestDate
        samplePickUpAddress
        sampleCollectionDate        
        samepleDropOffDate
        requestStatus
        patient{
            id
        #    user{
        #        id
        #        firstName
        #        lastName
        #    }
        }
        phlebotomist{
            id
         #   user{
         #       id
         #       firstName
         #       lastName
         #   }
        }
      #  tests {
      #      id
      #      name
      #      code
      #      testType
      #      group
      #  }
    }

  }
}`;

export const UPDATE_SAMPLE_COLLECTED_PH =`mutation UpdatePublicRequest($requestId: String!, $updateData: UpdatePublicRequestDataInput!) {
  UpdatePublicRequest(requestId: $requestId, updateData:$updateData
  ) {
    request{
        requestDate
        samplePickUpAddress
        sampleCollectionDate
        samepleDropOffDate
        requestStatus
        patient{
            id
            user{
                id
                firstName
                lastName
            }
        }
        phlebotomist{
            id
            user{
                id
                firstName
                lastName
            }
        }
        publicRequestId {
          id
          test {
            id
            name
            code
          }
        }
    }

  }
}`;

export const GET_INACTIVE_INCOME = `query getPhlebotomistPayment($phlebotomist: ID!){
    getPhlebotomistInActivePayment(phlebotomist: $phlebotomist){
        inactiveIncome
        ongoingRequest
        completedRequest
        scheduledRequest
        cancelledRequest
        # isPaid
        # potentialEarning
    }
}`;

export const GET_CONSULTATION_BY_CONSULTATION_ID = `query getConsultationById($id: ID!){
    getConsultationById(id: $id){
        status
        patient{
            id
            requestPatient{
                    id
                    requestDate
                    
                }
                user{
                   firstName  
                   lastName
                   email
                    city
                    country
                    streetAddress
                    streetAddress2
                    phoneNumber
                    state
                }
        }
        doctor{
            id
        }
        purpose
        medicalhistory
        currentSyptoms
        prescription
        doctorsReport
        attachments
        otherdetails
        requestedDoctorType
        requestedDuration
        consultationTime
        consultationStartedAt
        doctorEarning
    }
}`;


export const CREATE_WORK_TOOLS = `mutation CreateWorkTool(
    $phlebotomistId: ID!
    $createWorkToolInputData:CreateWorkToolInput!
){
    CreateWorkTool(
        phlebotomistId: $phlebotomistId
        createWorkToolInputData:$createWorkToolInputData
    ){
        workTool{
            phlebotomist{
                id
            }
                status
            sambleBottle
            methlylatedSpirit
            alcoholPad
            handSanitizer
            N95Facemask
            surgicalFacemask
            antisepticWipes
            nitrileGloves
            latexgloves
            powderFreeGloves
            vacutainers
            syringes
            needles
            tourniquets
            lancets
            pipettes
            droppers
            cottonWool
            gauzePads
   	        thermometer
            adhesiveBandages
            bloodPressureMonitor
            glucometer
            glucoseTestStrip
            EDTATube
            heparinTubes
            serumSeparatingTubes
            urineSampleCups
            stoolSampleContainers
            swabs
            specimenBags
            insulatedTransportContainers
            disinfectants
            wasteDisposalBags
            needleDisposalContainers
            barcodeLabels
            permanentMarkers
            specimenLabels
            boltStrips
            pressureCuff
            description
            others
        }
    }
}`;


export const GET_PUBLIC_HEALTH_REQUEST =`query getPublicRequestQueue( $limit: Int!, $offset: Int!,$search:String){
        getPublicRequestQueue(limit: $limit, offset: $offset, search:$search){
            requestsCount
            requests{
                id
                requestDate
                requestStatus
                noOfPeople
                patient{
                    id
                    organisationName
                    organisationType
                    user{
                    firstName  
                    lastName
                    email

                    }
                }
        publicRequestId{
          id
          test{
            id
            name
            code
          }
        }
                      facility{
                    id
                    facilityName
                }
                payment{
                    id
                }
                total
                }
            
        }

}`;

export const GET_INDIVIDUAL_ORGANIZATION_REQUEST = `query getRequestsQueue( $limit: Int!, $offset: Int!,$search:String){
        getRequestsQueue(limit: $limit, offset: $offset, search:$search){
            requestsCount
            requests{
                id
                requestDate
                requestStatus
                samplePickUpAddress
                sampleCollectionDate
                pickupDistance
                dropOffDistance
                balance
                # payment{
                #     amountCharged
                #     amountPaid
                #     paymentPlan                    
                # }
                # cancelledBy
                # cancellationReason

                patient{
                    id
                    organisationName
                    organisationType
                    user{
                    firstName  
                    lastName
                    email
                    phoneNumber
                    
                    }
                }
                tests{
                    id
                    name
                    code
                    
                }
                requestId{
                    id
                    patientName
                    patientAge
                }
                # payment{
                #     id
                # }
                total
                }
            
        }

}`;



            



export const GET_ALL_CHARGES =`query getCharges{
    getCharges{
        serviceCharge
        chargePerDistance
        consultationCharge
        consultationDiscount
        partPayment
        doctorsPercentage
        phlebotomistPercentage
        budgetPerDistance
        referralBonusPercentage
        baseCharge
        lastChangedBy{
            id
            user{
                id
                email
                firstName
                lastName
            }
        }
        admin{
            id
            user{
                id
                email
            }       
        }
    }
}`;


export const ACCEPT_PUBLIC_HEALTH_ASSIGNMENT = `mutation AcceptPublicRequest(
    $requestId: ID!,
    $phlebotomistId: ID!
    ){
    AcceptPublicRequest(
        requestId: $requestId,
        phlebotomistId: $phlebotomistId
        ){
        request{
            id
            facility{
                id

            }
            facilityTotal
            facilityDiscount
            facilityEarning
            facilityDistance
            dropOffDistance
            samplePickUpAddress
            requestDate
            sampleCollectionDate
            samepleDropOffDate
            requestStatus
            total
            phlebotomist{
                id
                user{
                   firstName  
                   lastName
                   email

                }

            }
            patient{
                id
                user{
                   firstName  
                   lastName
                   email

                }
            }
            publicRequestId{
              id
              test{
                id
                name
                code
              }
            }
            
        }

    }}`;

    // {
    //   "requestId": "fe41db5a-0a87-4ef3-9bcf-29e5584dc2d9",
    //   "phlebotomistId": "605c5ae2-675b-444b-be7a-0b67353e9850"
    // }

    export const REJECT_PUBLIC_HEALTH_REQUEST =`mutation RejectPublicRequest(
    $requestId: ID!
    ){
    RejectPublicRequest(
        requestId: $requestId
        ){
        request{
            id
            facility{
                id

            }
            facilityTotal
            facilityDiscount
            facilityEarning
            facilityDistance
            dropOffDistance
            samplePickUpAddress
            requestDate
            sampleCollectionDate
            samepleDropOffDate
            requestStatus
            total
            phlebotomist{
                id
                user{
                   firstName  
                   lastName
                   email

                }

            }
            patient{
                id
                user{
                   firstName  
                   lastName
                   email

                }
            }
            publicRequestId{
              id
              test{
                id
                name
                code
              }
            }
            
        }

    }

}`;

export const ACCEPT_GENERAL_REQUEST =`mutation AcceptRequest(
    $requestId: ID!,
    $phlebotomistId: ID!
    ){
    AcceptRequest(
        requestId: $requestId,
        phlebotomistId: $phlebotomistId
        ){
        request{
            id
            dropOffDistance
            samplePickUpAddress
            requestDate
            sampleCollectionDate
            samepleDropOffDate
            requestStatus
            total
            phlebotomist{
                id
                user{
                   firstName  
                   lastName
                   email

                }

            }
            patient{
                id
                user{
                   firstName  
                   lastName
                   email

                }
            }
            tests{
                id
                name
                code
            }
            
        }

    }
}`;

export const REJECT_GENERAL_REQUEST = `mutation RejectRequest(
    $requestId: ID!
    ){
    RejectRequest(
        requestId: $requestId
        ){
        request{
            id
            dropOffDistance
            samplePickUpAddress
            requestDate
            sampleCollectionDate
            samepleDropOffDate
            requestStatus
            total
        #    phlebotomist{
         #       id
          #      user{
           #        firstName  
            #       lastName
             #      email

              #  }

            #}
            #patient{
             #   id
              #  user{
               #    firstName  
                #   lastName
                 #  email

                #}
            #}
           # tests{
            #    id
             #   name
              #  code
            #}
            
        }

    }

}`;



export const GET_ALL_PUBLIC_HEALTH_BY_PHLEB =`query getPublicRequestsByUser( $limit: Int!, $offset: Int!, $patientId: ID, $phlebotomistId: ID, $filter: String){
    getPublicRequestsByUser(limit: $limit, offset: $offset, patientId: $patientId, phlebotomistId: $phlebotomistId, filter: $filter ){
      requestsCount
      requests {
        id
        noOfPeople        
        samplePickUpAddress
        requestStatus
        samepleDropOffDate
        sampleCollectionDate
        requestDate
        dropOffDistance
        createdAt
        requestDate
        total
        patient{
            id
            organisationName
            organisationType
            noOfEmployees
            user{
              firstName  
              lastName
              email
              phoneNumber
              id
              
            }
        }
        phlebotomist{
            id
            user{
                id
                firstName  
              lastName
              email
              phoneNumber
            }
            phlebotomistEarning
        }
        facility{
            id
            facilityName
            
            user{
                id
                firstName  
                lastName
                email
            }
        }
        payment{
            id
            amountPaid
            amountCharged
        }
        publicRequestId{
            id
            test{
                id
                name
                code 
            }
            patientName
            patientAge
            
            # gender
            status
            package{
                id
                packageName
            }
            result{
                id
            }
            resultDate
        }
      }
    }

  }`;

  export const GET_INDIVIDUAL_ORGANIZATION_REQUEST_NEW = `
  query getRequestByUsers(
  $phlebotomistId: ID
  $patientId: ID
  $limit: Int
  $offset: Int
) {
  getRequestByUsers(
    phlebotomistId: $phlebotomistId
    patientId: $patientId
    limit: $limit
    offset: $offset
  ) {
    requests {
      id
      sampleCollectionDate
      samepleDropOffDate
      requestStatus
      isPaid
      pickupDistance
      dropOffDistance
      phlebotomistEarning
      labtracaProfit
      hasPhlebotomistBeenPaid
      requestDate
      samplePickUpAddress
      balance
      coveredAmount
      total
      totalPaymentSum
      requestStatus
      testRequestCount
      requestProfitMargin
      logisticsEstimate  
      distanceCharge
 
    #   patient{
    #     id
    #     requestPatient{
    #         id
    #         requestDate
            
    #     }
    #     user{
    #         firstName
    #         lastName
    #         email
    #         city
    #         country
    #         streetAddress
    #         streetAddress2
    #         phoneNumber
    #         state
    #     }
    #   }
      phlebotomist{
        id
        user{
            id
            firstName
            lastName
            email
            phoneNumber

        }
      }
      tests{
        id
        name
        code
        
        price
        # requestedtest{
        #     id
        #     facility{
        #         id
        #         facilityName
        #     }
        # }
      }
      testRequest{

        # patientName
        # patientAge
        # status
        # facilityDistance
        result{
            id
            generatedPdfUrl

        }
      }
      
    }
    requestsCount
  }
}

# b2d042c9-ecfa-4b9a-9c0c-0800e0e50de6
`;
  
  
  // `
  // query getRequestByPhlebotomist($phlebotomistId: ID!, $limit: Int, $offset: Int,){
  //   getRequestByPhlebotomist(phlebotomistId: $phlebotomistId, limit: $limit, offset: $offset){
  //     requestsCount
  //     requests {
  //       id
  //       hasPhlebotomistBeenPaid
  //       requestProfitMargin
  //       logisticsEstimate
  //       phlebotomistEarning
  //       distanceCharge
  //       labtracaProfit
  //       requestDate
  //       pickupDistance
  //       dropOffDistance
  //       sampleCollectionDate
  //       samepleDropOffDate
  //       samplePickUpAddress
  //       requestStatus        
  //       isPaid
  //       balance
  //       total
  //       patient{
  //           id
  //           user{
  //               firstName
  //               lastName
  //               email
  //               phoneNumber
  //           }
  //       }
  //       requestId{
  //           id
  //           patientName
  //           patientAge    
  //           status
  //           test{
  //               id
  //               name
  //           }
  //           request{
  //               id                
                
  //           }
                    
  //       }
        
  //       # testRequest{
  //       #     id
  //       #     patientName
  //       #     patientAge
  //       # }
  //       patient{
  //           id
  //           testChoice
            
  //       }
  //     }
  //   }

  // }`;
  
  
  // `query getRequestByPhlebotomist($phlebotomistId: ID!, $limit: Int, $offset: Int,){
  //   getRequestByPhlebotomist(phlebotomistId: $phlebotomistId, limit: $limit, offset: $offset){
  //     requestsCount
  //     requests {
  //       id
  //       hasPhlebotomistBeenPaid
  //       requestProfitMargin
  //       logisticsEstimate
  //       phlebotomistEarning
  //       distanceCharge
  //       labtracaProfit
  //       requestDate
  //       pickupDistance
  //       dropOffDistance
  //       sampleCollectionDate
  //       samepleDropOffDate
  //       samplePickUpAddress
  //       requestStatus        
  //       balance
  //     }
  //   }

  // }`;


  export const SEND_PASSWORD_RESET_EMAIL = `mutation SendPasswordResetEmail($email: String!){
    SendPasswordResetEmail(email: $email){
        success
        errors
    }
}`;


export const GET_REQUEST_DISTANCE = `
query getRequestDistance($phlebotomistId: ID!, $requestId: ID!) {
  getRequestDistance(phlebotomistId: $phlebotomistId, requestId: $requestId)
}
`;
export const GET_REQUEST_DISTANCE_PH = `
query getPublicRequestDistance($phlebotomistId: ID!, $requestId: ID!){
    getPublicRequestDistance(phlebotomistId: $phlebotomistId, requestId: $requestId)
  }
`;


export const UPDATE_REQUEST_PATIENT = `mutation UpdatePublicRequestTest($requestId: ID!, $patients: [PublicRequestPatient]!) {
    UpdatePublicRequestTest(requestId: $requestId, patients:$patients
    ) {
        testRequest{
            id
            request{
                id
            }
            specimen
            recommendedBy
            patientName
            patientAge
            gender
            test {
                id
                name
                code
                testType
                group
            }
        }
    }
}`;


export const UPDATE_PUBLIC_TEST_REQUEST = `mutation UpdatePublicTestRequest($testrequestId: ID!, $updateData: UpdatePublicRequestTestRequestInput!) {
    UpdatePublicTestRequest(testrequestId: $testrequestId, updateData:$updateData
    ) {
        testRequest{
            id
            status
            gender
            request{
                id
            }
            specimen
            recommendedBy
            patientName
            patientAge
            gender
            test {
                id
                name
                code
                testType
                group
            }
        }
    }
}`;


//////////AUDING TOOLS

export const CREATE_REQUEST_TOOL_AUDIT = `mutation CreateWorkTool(
  $phlebotomistId: ID!
  $input: CreateWorkToolInput!
) {
  CreateWorkTool(
    phlebotomistId: $phlebotomistId
    createWorkToolInputData: $input
  ) {
    # success
    # message
    workTool {
      id
    #   phlebotomistId
        sambleBottle
        methlylatedSpirit
        alcoholPad
        handSanitizer
        N95Facemask
        surgicalFacemask
        antisepticWipes
        nitrileGloves
        latexgloves
        powderFreeGloves
        vacutainers
        syringes
        needles
        tourniquets
        lancets
        pipettes
        droppers
        cottonWool
        gauzePads
        thermometer
        adhesiveBandages
        bloodPressureMonitor
        glucometer
        glucoseTestStrip
        EDTATube
        heparinTubes
        serumSeparatingTubes
        urineSampleCups
        stoolSampleContainers
        swabs
        specimenLabels
        insulatedTransportContainers
        disinfectants
        wasteDisposalBags
        needleDisposalContainers
        barcodeLabels
        permanentMarkers
        specimenLabels
        boltStrips
        pressureCuff
        # usageReport
others
    }
}
}
`;


////////////////////////////////////////
export const GET_ALL_CONSULTATIONS = gql`query getAllConsultations(
  $limit: Int!
  $offset: Int!
  $status: String
  $searchTerm: String
  $patientId: ID
  $doctorId: ID
  $queueOnly: Boolean
) {
  getAllConsultations(
    limit: $limit
    offset: $offset
    status: $status
    searchTerm: $searchTerm
    patientId: $patientId
    doctorId: $doctorId
    queueOnly: $queueOnly
  ) {
    consultationCount
    consultations {
      id
      status
      patientName
      patientAge
      purpose
      total
      createdAt
      updatedAt
      requestedDuration
      requestedDoctorType
      total
      totalPaymentSum
      doctor {
        id
        firstName
        lastName
      }
      patient {
        id
        firstName
        lastName
      }
    }
  }
}


# {
#   "patientId": "c08f7c31-5816-48b2-9e4c-f30223f5cfdf",
#   "doctor": ""
# }`;

export const GET_CONSULTATION_BY_ID = gql`query GetConsultationById($id: ID!) {
  getConsultationById(id: $id) {
    id
    #gender
    createdAt
    updatedAt
    status
    patientName
    patientAge
    purpose
    medicalhistory
    currentSyptoms
    prescription
    doctorsReport
    otherdetails
    requestedDoctorType
    requestedDuration
    consultationStartedAt
    consultationEndedAt
    total
    bonusUsed
    discount
    doctorEarning
    labtracaProfit
    hasDoctorBeenPaid
    totalPaymentSum

    patient {
      id
      firstName
      lastName
      email
      phoneNumber
    }

    doctor {
      id
      firstName
      lastName
      email
      phoneNumber
    }

    payment {
      id
      amountPaid
    #   status
      createdAt
    }

    #consultationMessages {
     # id
    #   message
     # sender {
      #  id
       # firstName
        #lastName
      #}
      #createdAt
    #}

    #consultationRoom {
      #id
    #   message
      #createdAt
      #sender {
       # id
        #firstName
        #lastName
      #}
    #}

    attachments
  }
}
`;

export const ACCEPT_CONSULTATION = gql`mutation AcceptConsultation(
  $consultationId: ID!
  #$doctorId: ID!
) {
  AcceptConsultation(
    consultationId: $consultationId
    #doctorId: $doctorId
  ) {
    consultation
  }
}`;

export const ACCEPT_RESULT_REVIEW = gql`mutation AcceptResultReview(
  $resultReviewId: ID!
  $doctorId: ID!
) {
  AcceptResultReview(
    resultReviewId: $resultReviewId
    doctorId: $doctorId
  ) {
    resultReview{
    message
    }
  }
}`;

export const GET_ALL_RESULT_REVIEWS = gql `query getAllResultReviews(
  $limit: Int!
  $offset: Int!
  $status: String
  $searchTerm: String
  $patientId: ID
  $doctorId: ID
  $queueOnly: Boolean
) {
  getAllResultReviews(
    limit: $limit
    offset: $offset
    status: $status
    searchTerm: $searchTerm
    patientId: $patientId
    doctorId: $doctorId
    queueOnly: $queueOnly
  ) {
    resultReviewCount
    resultReviews {
      id
      status
      gender
      patientName
      patientAge
      doctor {
        id
        firstName
        lastName
        userType
      }
      patient {
        id
        firstName
        lastName
        userType
      }
      purpose
      currentSyptoms
      medicalhistory
      otherdetails
      requestedDoctorType
      requestedDuration
      total
      createdAt
      updatedAt
      doctorsReport
      prescription
      results
    }
  }
}`;

export const GET_RESULT_REVIEW_BY_ID = gql `
query getResultReviewById(
  $id: ID! 
) {
  getResultReviewById(
    id: $id
    
  ) {
    
  id
  createdAt
  gender
  updatedAt
  status
  patient{
    id

  }
  patientName
  patientAge
  discount
  hasDoctorBeenPaid
  purpose
  medicalhistory
  currentSyptoms
  prescription
  doctorsReport
  results
  total
  otherdetails
  requestedDoctorType
  requestedDuration
  payment{
    id
    amountCharged
    amountPaid
    referrence
    invoice
    description
  }
  totalPaymentSum
#   resultReviewTransactions{
#     id

#   }
  doctor{
    id
    lastName
    consultationDoctor{
        attachments
        gender

    }
  }
  }
}
`;


export const GET_ALL_REQUESTS = gql `query getAllRequests(
  $limit: Int!
  $offset: Int!
  $requestStatus: String
  $searchTerm: String
  $patientId: ID
  $phlebotomistId: ID
  $queueOnly: Boolean
) {
  getAllRequests(
    limit: $limit
    offset: $offset
    requestStatus: $requestStatus
    searchTerm: $searchTerm
    patientId: $patientId
    phlebotomistId: $phlebotomistId
    queueOnly: $queueOnly
  ) {
    requestsCount
    requests {
      id
      requestStatus
      requestDate
      deliveryMode
      dropoffSelectedAt
      logisticsEstimate
      coveredAmount
      # ---------------------------
      # USER (PATIENT) DETAILS
      # ---------------------------
      patient {
        id
        firstName
        lastName
        phoneNumber
        email
        origin
      }

              requestId{
            id
            patientAge
            patientName
            gender
            request{
                id
                testRequests{
                    test{
                        id
                        name
                        code
                    }
                }
            }
        }
      # ---------------------------
      # LOGISTICS & CALCULATIONS
      # ---------------------------
      logisticsEstimate          # sample pickup amount
      distanceCharge             # drop-off to lab amount
      phlebotomistEarning
      labtracaProfit
      requestProfitMargin

      pickupDistance
      dropOffDistance
      hasPhlebotomistBeenPaid

      # ---------------------------
      # PAYMENT SUMMARY
      # ---------------------------
      total
      balance
      coveredAmount
      totalPaymentSum
      isPaid

      # ---------------------------
      # SAMPLE DATES
      # ---------------------------
      sampleCollectionDate
      samepleDropOffDate

      samplePickUpAddress

      # ---------------------------
      # PHLEBOTOMIST
      # ---------------------------
      phlebotomist {
        id
        firstName
        lastName
        email
        phoneNumber
      }

      # ---------------------------
      # TESTS
      # ---------------------------
      testRequestCount
      testRequests {
        patientName
        patientAge
        status
        facilityDistance
        result {
          id
          generatedPdfUrl
        }
        test {
          id
          name
          code
          price
        }
          # 🚀 NEW FACILITY SECTION
        facility {
          id
          facilityName
          facilityType
          rating
          streetAddress
          streetAddress2
          city
          state
          country
          postal
          latitude
          longitude
        }

      }
    }
  }
}`;



// `
// query getAllRequests(
//   $limit: Int!
//   $offset: Int!
//   $requestStatus: String
//   $searchTerm: String
//   $patientId: ID
//   $phlebotomistId: ID
//   $queueOnly: Boolean
// ) {
//   getAllRequests(
//     limit: $limit
//     offset: $offset
//     requestStatus: $requestStatus
//     searchTerm: $searchTerm
//     patientId: $patientId
//     phlebotomistId: $phlebotomistId
//     queueOnly: $queueOnly
//   ) {
//     requestsCount
//     requests {
//        id
//       sampleCollectionDate
//       samepleDropOffDate
//       requestStatus
//       deliveryMode
//       dropoffSelectedAt
//       isPaid
//       pickupDistance
//       dropOffDistance
//       phlebotomistEarning
//       labtracaProfit
//       hasPhlebotomistBeenPaid
//       requestDate
//       samplePickUpAddress
//       balance
//       coveredAmount
//       total
//       totalPaymentSum
//       requestStatus
//       testRequestCount
//       requestProfitMargin
//       logisticsEstimate  
//       distanceCharge
 
//       patient{
//         id
//         # gender
//         # testChoice
//         # noOfEmployees
//         origin
            
//         }
//         requestId{
//             id
//             patientAge
//             patientName
//             gender
//             request{
//                 id
//                 testRequests{
//                     test{
//                         id
//                         name
//                         code
//                     }
//                 }
//             }
//         }
//       phlebotomist{
//         id
//         firstName
//         lastName
//         email
//         phoneNumber       
//       }
      
//       testRequests{

//         patientName
//         patientAge
//         status
//         facilityDistance
//         result{
//             id
//             generatedPdfUrl

//         }
//         test{
//         id
//         name
//         code
//         price

//       }
//       }
      
//     }
//   }
// }`;

// `
// query getAllRequests(
//   $limit: Int!
//   $offset: Int!
//   $requestStatus: String
//   $searchTerm: String
//   $patientId: ID
//   $phlebotomistId: ID
//   $queueOnly: Boolean
// ) {
//   getAllRequests(
//     limit: $limit
//     offset: $offset
//     requestStatus: $requestStatus
//     searchTerm: $searchTerm
//     patientId: $patientId
//     phlebotomistId: $phlebotomistId
//     queueOnly: $queueOnly
//   ) {
//     requestsCount
//     requests {
//        id
//       sampleCollectionDate
//       samepleDropOffDate
//       requestStatus
//       isPaid
//       pickupDistance
//       dropOffDistance
//       phlebotomistEarning
//       labtracaProfit
//       hasPhlebotomistBeenPaid
//       requestDate
//       samplePickUpAddress
//       balance
//       coveredAmount
//       total
//       totalPaymentSum
//       requestStatus
//       testRequestCount
//       requestProfitMargin
//       logisticsEstimate  
//       distanceCharge
 
//       patient{
//         id
//         # gender
//         # testChoice
//         # noOfEmployees
//         origin
            
//         }
//         requestId{
//             id
//             patientAge
//             patientName
//             gender
//             request{
//                 id
//                 testRequests{
//                     test{
//                         id
//                         name
//                         code
//                     }
//                 }
//             }
//         }
//       phlebotomist{
//         id
//         firstName
//         lastName
//         email
//         phoneNumber       
//       }
      
//       testRequests{

//         patientName
//         patientAge
//         status
//         facilityDistance
//         result{
//             id
//             generatedPdfUrl

//         }
//         test{
//         id
//         name
//         code
//         price

//       }
//       }
      
//     }
//   }
// }
// `;

export const SET_REQUEST_DELIVERY_MODE = `
  mutation SetRequestDeliveryMode(
  $requestId: ID!
  $deliveryMode: String!
  $isTimeSensitive: Boolean!
) {
  SetRequestDeliveryMode(
    requestId: $requestId
    deliveryMode: $deliveryMode
    isTimeSensitive: $isTimeSensitive
  ) {
    request {
      id
      deliveryMode
      isTimeSensitive
    }
  }
}

`;
export const GET_COUNTRIES = `query GetAllDropOffCountries($search: String) {
  getAllDropOffCountries(search: $search) {
    id
    name
    code
  }
}`;

export const GET_STATE =  `query GetDropOffStatesByCountry($countryId: ID!) {
  getDropOffStatesByCountry(countryId: $countryId) {
    id
    name
  }
}
`;

export const GET_LOCATION_BY_STATE = `query GetDropOffAreasByState($stateId: ID!) {
  getDropOffAreasByState(stateId: $stateId) {
    id
    name
    description
  }
}
`;

export const SET_SELECT_REQUEST_DROP_OFF_LOCATION = `mutation SelectRequestDropoffLocation(
  $requestId: ID!
  $dropOffLocationId: ID!
) {
  SelectRequestDropoffLocation(
    requestId: $requestId
    dropOffLocationId: $dropOffLocationId
  ) {
    request {
      id
      dropoffLocation {
        id
        name
      }
      dropoffSelectedAt
    }
  }
}
`;


export const GET_DROP_OFF_LOCATION =  `query GetDropOffLocations(
  $dropOffAreaId: ID!
  $activeOnly: Boolean
) {
  dropOffLocations(
    dropOffAreaId: $dropOffAreaId,
    activeOnly: $activeOnly
  ) {
    id
    name
    address
    isActive
  }
}`;


export const CONFIRM_REQUEST_DROP_OFF = `
mutation ConfirmRequestDropoff($requestId: ID!) {
  ConfirmRequestDropoff(requestId: $requestId) {
    request {
      id
      droppedAtLocation
      droppedAtLocationAt
      requestStatus
    }
  }
}`;


export const GET_AVAILABLE_REEQUESTS_FOR_PICK_UP = `query GetDispatcherReadyRequests {
  dispatcherReadyRequests {
    id
    requestType
    patientName
    droppedAtLocationAt
    deliveredToLabAt
    isTimeSensitive
    labFacilities
    numberOfSamples
    facilityAddresses
    facilityDistances
    dropoffLocation {
      id
      name
      address
      isActive
      dropOffArea {
        id
        name
        description
        isActive
        state {
          id
          name
          isActive
          country {
            id
            name
            code
            isActive
          }
        }
      }
    }
    sampleDetails {
      testName
      specimen
      facilityName
    }
  }
}`;


export const ACCEPT_DISPATCHER_PICK_UP = `mutation AcceptDispatcherPickup($requestId: ID!) {
  AcceptDispatcherPickup(requestId: $requestId) {
    request {
      id
      dispatcher {
        id
      }
      dispatcherAssignedAt
    }
  }
}
`;



export const UPDATE_CONSULTATION_REQUEST = `
mutation UpdateConsultation(
  $consultationId: ID!
  $updateData: UpdateConsultationDataInput!
) {
  UpdateConsultation(
    consultationId: $consultationId
    updateData: $updateData
  ) {
    consultation {
      id
      status
      prescription
      doctorsReport
      otherdetails
    }
  }
}
`;

  export const UPDATE_RESULT_REVIEW = `
  mutation UpdateResultReview($resultReviewId: ID!, $updateData: UpdateResultReviewDataInput!) {
    UpdateResultReview(resultReviewId: $resultReviewId, updateData: $updateData) {
      resultReview {
        id
        status
        purpose
        doctorsReport
        prescription
        requestedDuration
        requestedDoctorType
        updatedAt
      }
    }
  }
  `;

export const PREFERRED_REQUESTS = `query preferredRequests(
  $limit: Int!
  $offset: Int!
) {
  preferredRequests(
    limit: $limit
    offset: $offset
  ) {
    requestsCount
    requests {
      id
      requestStatus
      requestDate

      # ---------------------------
      # USER (PATIENT) DETAILS
      # ---------------------------
      patient {
        id
        firstName
        lastName
        phoneNumber
        email
        origin
      }

      # ---------------------------
      # LOGISTICS & CALCULATIONS
      # ---------------------------
      logisticsEstimate
      distanceCharge
      phlebotomistEarning
      labtracaProfit
      requestProfitMargin

      pickupDistance
      dropOffDistance
      hasPhlebotomistBeenPaid

      # ---------------------------
      # PAYMENT SUMMARY
      # ---------------------------
      total
      balance
      coveredAmount
      totalPaymentSum
      isPaid

      # ---------------------------
      # SAMPLE DATES
      # ---------------------------
      sampleCollectionDate
      samepleDropOffDate

      samplePickUpAddress

      # ---------------------------
      # PHLEBOTOMIST
      # ---------------------------
      phlebotomist {
        id
        firstName
        lastName
        email
        phoneNumber
      }

      # ---------------------------
      # TESTS
      # ---------------------------
      testRequestCount
      testRequests {
        patientName
        patientAge
        status
        facilityDistance
        result {
          id
          generatedPdfUrl
        }
        test {
          id
          name
          code
          price
        }
      }
    }
  }
}`;

export const REJECT_PREFERRED_REQUEST = `mutation RejectPreferredRequest($requestId: UUID!) {
  RejectPreferredRequest(requestId: $requestId) {
    request {
      id
      requestStatus
    }
  }
}`;

export const PREFERRED_CONSULTATIONS = `query preferredConsultations($limit: Int!, $offset: Int!) {
  preferredConsultations(limit: $limit, offset: $offset) {
    consultationCount
    consultations {
      id
      status
      purpose
      total
      patientName
      patientAge
      createdAt
      updatedAt
      patient {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      doctor {
        id
        firstName
        lastName
        email
        phoneNumber
      }
    }
  }
}`;

export const REJECT_PREFERRED_CONSULTATION = `mutation RejectPreferredConsultation($consultationId: ID!) {
  RejectPreferredConsultation(consultationId: $consultationId) {
    consultation {
      id
    }
  }
}`;

export const DISPATCH_ACCETED_RESQUEST = `query GetMyAcceptedRequests {
  myAcceptedRequests {
    id
    requestStatus
    deliveryMode
    requestType
    patientName
    droppedAtLocationAt
    deliveredToLabAt
    isTimeSensitive
    labFacilities
    numberOfSamples
    dispatcherEarning
    facilityAddresses
    facilityDistances
    dropoffLocation {
      id
      name
      address
      isActive
      dropOffArea {
        id
        name
        description
        isActive
        state {
          id
          name
          isActive
          country {
            id
            name
            code
            isActive
          }
        }
      }
    }
    sampleDetails {
      testName
      specimen
      facilityName
    }
  }
}`;

export const DISPATCH_CONFIRM_PICK_UP =`mutation DispatcherConfirmPickup($requestId: ID!) {
  DispatcherConfirmPickup(requestId: $requestId) {
    request {
      id
      pickedFromDropoffAt
      requestStatus
    }
  }
}
`;


export const DISPATCHER_CONFIRM_DELIVERY_TO_LAB = `mutation DispatcherConfirmDeliveryToLab($requestId: ID!, $testRequestId: ID) {
  DispatcherConfirmDeliveryToLab(requestId: $requestId, testRequestId: $testRequestId) {
    request {
      id
      requestStatus
      deliveredToLabAt
    }
    testRequest {
      id
      status
      deliveredToLabAt
    }
    pendingSamplesCount
  }
}`;

export const PHLEBOTOMIST_CONFIRM_DELIVERY_TO_LAB = `mutation PhlebConfirm($requestId: ID!, $testRequestId: ID) {
  PhlebotomistConfirmDeliveryToLab(requestId: $requestId, testRequestId: $testRequestId) {
    request { id deliveredToLabAt requestStatus }
    testRequest { id deliveredToLabAt status }
    pendingSamplesCount
  }
}`;

export const GET_PHLEB_STATS = `query GetPhlebStats($phlebId: ID!) {
  getRequestStatsByUser(phlebotomist: $phlebId) {
    completed
    pending
    ongoing
    cancelled
    scheduled
    unpaid
    accepted
  }
}`;

export const GET_DROP_OFF_LOCATIONS_BY_STATE = `
query GetDropOffLocationsByState($activeOnly: Boolean, $dispatcherStatus: DispatcherStatus, $limit: Int, $offset: Int) {
  getDropOffLocationsByState(activeOnly: $activeOnly, dispatcherStatus: $dispatcherStatus, limit: $limit, offset: $offset) {
    dropOffLocationsCount
    dropOffLocations {
      id
      name
      address
      isActive
      requestsCount
      samplesCount
      dropOffArea {
        id
        name
        state {
          id
          name
        }
      }
      requests {
        id
        requestStatus
        requestDate
        samplePickUpAddress
        total
        dispatcherEarning
        dispatcherKmCoverage
        testRequests {
          id
          status
          test {
            id
            name
          }
          patientDetails {
            id
            firstName
            lastName
            email
            phoneNumber
            location
            city
            state
            country
          }
          facilityDetails {
            id
            facilityName
            facilityType
            facilityEmail
            facilityPhoneNumber
            address
            city
            state
            country
          }
        }
      }
    }
  }
}



# Dispatcher Status Options

# 1. AVAILABLE
# 2. ACCEPTED
# 3. DELIVERED




  `;

export const GET_CURRENT_PHLEBOTOMIST_REQUESTS = `
  query GetCurrentPhlebotomistRequests(
  $limit: Int!
  $offset: Int!
  $requestStatus: String
) {
  getCurrentPhlebotomistRequests(
    limit: $limit
    offset: $offset
    requestStatus: $requestStatus
  ) {
    requestsCount
    requests {
      id
      deliveredToLabAt
      requestStatus
    #   created_at
    #   updated_at
      samplePickUpAddress
      deliveryMode
      dropoffSelectedAt

      # Request financials
      total
      serviceCharge
      logisticsEstimate
      phlebotomistEarning
      pickupDistance
      dropOffDistance
      costOfTests
      isPaid
      balance
      totalPaymentSum
      coveredAmount
      hasPhlebotomistBeenPaid

      # Patient details
      patientDetails {
        id
        firstName
        lastName
        email
        phoneNumber
        streetAddress
        city
        state
        country
        location
        latitude
        longitude
      }

      # Phlebotomist details + earnings
      phlebotomistDetails {
        id
        firstName
        lastName
        email
        phoneNumber
        uniqueId
        potentialEarning
        pickupDistanceKm
        dropOffDistanceKm
        logisticsEstimate
        serviceCharge
        hasBeenPaid
      }

      # Per-test + facility details
      testRequests {
        id
        status
        testName
        testCode
        price
        testPrice
        actualTestPrice
        markupPrice
        facilityDiscountPercentage

        facilityDetails {
          id
          facilityName
          facilityType
          facilityEmail
          facilityPhoneNumber
          address
          city
          state
          country
        }

        patientDetails {
          id
          firstName
          lastName
          email
          phoneNumber
          location
          city
          state
          country
        }
      }
    }
  }
}
`;

export const GET_MY_REQUEST_NOTIFICATIONS = `
query GetMyRequestNotifications {
  getMyRequestNotifications {
    id
    title
    body
    read
    createdAt
    meta
  }
}`;

export const GET_MY_UNREAD_REQUEST_NOTIFICATION_COUNT = `
query GetMyUnreadRequestNotificationCount {
  getMyUnreadRequestNotificationCount
}`;

export const MARK_REQUEST_NOTIFICATION_READ = `
mutation MarkRequestNotificationRead($notificationId: ID) {
  MarkRequestNotificationRead(notificationId: $notificationId) {
    notification {
      message
      code
    }
  }
}`;

export const REGISTER_DEVICE_TOKEN = gql`
  mutation RegisterDeviceToken($token: String!, $platform: String!) {
    registerDeviceToken(token: $token, platform: $platform) {
      result {
        message
        code
      }
    }
  }
`;

export const UNREGISTER_DEVICE_TOKEN = gql`
  mutation UnregisterDeviceToken($token: String!) {
    unregisterDeviceToken(token: $token) {
      result {
        message
        code
      }
    }
  }
`;








// import { GET_USER_BY_ID_ADMIN } from "@/schema/apiSchema";
// import client from "@/schema/apolloClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_USER_BY_ID_ADMIN_1 } from "../../schema/ApiSchema";
import client from "../../schema/apolloClient"; // ✅ make sure this exports a configured ApolloClient instance


export const fetchUserDetails = createAsyncThunk(
  "userDetails/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      // const client = useApolloClient();
      const storedID = await AsyncStorage.getItem("id_");
      if (!storedID) throw new Error("No ID found in AsyncStorage");
      console.log('IDDDDDDD ::::: ', atob(storedID).replace("UserNode:", ""));
      console.log('IDDDDDDD ::::: ', atob("VXNlck5vZGU6YzZhOGQ4ODktNDcyOS00YzUwLWJjZmQtYWM5MjBlNzMxZDQ5").replace("UserNode:", ""));

      const decodedId = atob(storedID).replace("UserNode:", "");
      const { data } = await client.query({
        query: GET_USER_BY_ID_ADMIN_1,
        variables: { id: decodedId },
        fetchPolicy:  "network-only",  //"cache-first",//
      });

      return {
        user: data?.getUserById || null,
        id: decodedId,
      };
    } catch (err: any) {
  console.error("Error fetching user details:", err);

  // 🔴 If unauthorized → force logout
  if (
    err?.networkError?.statusCode === 401 ||
    err?.graphQLErrors?.some(
      (e: any) => e.extensions?.code === "UNAUTHENTICATED"
    )
  ) {
    return rejectWithValue("UNAUTHORIZED");
  }

  return rejectWithValue(err.message);
}
    
    
    
  //   catch (err) {
  //     console.error("Error fetching user details XXXX:", err.message);
  //     console.log("Full Apollo Error:", JSON.stringify(err, null, 2));
  // if (err.networkError) {
  //   console.log("Network Error:", err.networkError);
  // }
  // if (err.graphQLErrors) {
  //   console.log("GraphQL Errors:", err.graphQLErrors);
  // }
  //     return rejectWithValue(err.message);
  //   }
  }
);

const userDetailsSlice = createSlice({
  name: "userDetails_",
  initialState: {
    userData: null,
    loading: false,
    error: null,
    patientId: null,
  },
  reducers: {
    clearUserDetails: (state) => {
      state.userData = null;
      state.error = null;
      state.patientId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        state.patientId = action.payload.id;
      })
      // .addCase(fetchUserDetails.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        if (action.payload === "UNAUTHORIZED") {
          state.userData = null;
        }
      });
  },
});

export const { clearUserDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;

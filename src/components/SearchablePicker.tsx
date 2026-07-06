import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronRight } from "lucide-react-native";

export default function SearchablePicker({
  data,
  selectedValue,
  onValueChange,
  placeholder = "Select Bank",
  searchPlaceHolder = "Search bank...",
  containerClassName,
  showChevron,
  trailingIcon,
}: {
  data: { id: string; name: string }[];
  selectedValue?: string;
  onValueChange: (id: string, name: string) => void;
  placeholder?: string;
  searchPlaceHolder?: string;
  containerClassName?: string;
  showChevron?: boolean;
  trailingIcon?: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Find the selected item's name based on selectedValue (id)
  const selectedItem = data.find((item) => item.id === selectedValue);
  const displayText = selectedItem ? selectedItem.name : placeholder;

  return (
    <>
      {/* Display Selected Value */}
      <TouchableOpacity
        style={containerClassName ? undefined : styles.dropdown}
        className={containerClassName}
        onPress={() => setVisible(true)}
      >
        {containerClassName && (showChevron || trailingIcon) ? (
          <View className="flex-row justify-between items-center">
            <Text style={{ color: selectedValue ? "#000" : "#181717ff", fontSize: 16 }}>
              {displayText}
            </Text>
            {trailingIcon ?? <ChevronRight size={16} color="#475569" />}
          </View>
        ) : (
          <Text style={{ color: selectedValue ? "#000" : "#181717ff", fontSize: 16 }}>
            {displayText}
          </Text>
        )}
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            placeholder={searchPlaceHolder}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onValueChange(item.id, item.name); // pass id as selectedValue
                  setVisible(false);
                  setSearch("");
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

// export default function SearchablePicker({
//   data,
//   selectedValue,
//   onValueChange,
//   placeholder = "Select Bank",
//   searchPlaceHolder = "Search bank...",
// }) {
//   const [visible, setVisible] = useState(false);
//   const [search, setSearch] = useState("");

//   const filteredData = data.filter((item) =>
//     item.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       {/* Display Selected Value */}
//       <TouchableOpacity
//         style={styles.dropdown}
//         onPress={() => setVisible(true)}
//       >
//         <Text style={{ color: selectedValue ? "#000" : "#181717ff", fontSize: 16, width: "100%" }}>
//             {selectedValue !== null && selectedValue !== undefined && selectedValue !== "" && selectedValue !== "Select Bank"
//   ? data.find((item) => item.code === selectedValue)?.name
//   : placeholder}

//           {/* {selectedValue
//             ? data.find((item) => item.code === selectedValue)?.name
//             : placeholder} */}
//         </Text>
//       </TouchableOpacity>

//       {/* Modal */}
//       <Modal visible={visible} animationType="slide">
//         <View style={styles.modalContainer}>
//           <TextInput
//             placeholder={searchPlaceHolder} //"Search bank..."
//             value={search}
//             onChangeText={setSearch}
//             style={styles.searchInput}
//           />

//           <FlatList
//             data={filteredData}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.item}
//                 onPress={() => {
//                   onValueChange(item.code, item.name);
//                   setVisible(false);
//                   setSearch("");
//                 }}
//               >
//                 <Text>{item.name}</Text>
//               </TouchableOpacity>
//             )}
//           />

//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setVisible(false)}
//           >
//             <Text style={{ color: "#fff" }}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </>
//   );
// }

const styles = StyleSheet.create({
  dropdown: {
    padding: 15,
    // borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    width: "100%"
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    width: "100%"
  },
  searchInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  closeButton: {
    backgroundColor: "#000",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
});




// import React, { useState } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   StyleSheet,
// } from "react-native";

// export default function SearchablePicker({
//   data,
//   selectedValue,
//   onValueChange,
//   placeholder = "Select Bank",
// }) {
//   const [visible, setVisible] = useState(false);
//   const [search, setSearch] = useState("");

//   const filteredData = data.filter((item) =>
//     item.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       {/* Display Selected Value */}
//       <TouchableOpacity
//         style={styles.dropdown}
//         onPress={() => setVisible(true)}
//       >
//         <Text style={{ color: selectedValue ? "#000" : "#999", fontSize: 16, width: "100%" }}>
//             {selectedValue !== null && selectedValue !== undefined && selectedValue !== "" && selectedValue !== "Select Bank"
//   ? data.find((item) => item.code === selectedValue)?.name
//   : placeholder}

//           {/* {selectedValue
//             ? data.find((item) => item.code === selectedValue)?.name
//             : placeholder} */}
//         </Text>
//       </TouchableOpacity>

//       {/* Modal */}
//       <Modal visible={visible} animationType="slide">
//         <View style={styles.modalContainer}>
//           <TextInput
//             placeholder="Search bank..."
//             value={search}
//             onChangeText={setSearch}
//             style={styles.searchInput}
//           />

//           <FlatList
//             data={filteredData}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.item}
//                 onPress={() => {
//                   onValueChange(item.code, item.name);
//                   setVisible(false);
//                   setSearch("");
//                 }}
//               >
//                 <Text>{item.name}</Text>
//               </TouchableOpacity>
//             )}
//           />

//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setVisible(false)}
//           >
//             <Text style={{ color: "#fff" }}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   dropdown: {
//     padding: 15,
//     // borderWidth: 1,
//     borderRadius: 8,
//     borderColor: "#ccc",
//     width: "100%"
//   },
//   modalContainer: {
//     flex: 1,
//     padding: 20,
//     width: "100%"
//   },
//   searchInput: {
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//     width: "100%",
//   },
//   item: {
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//   },
//   closeButton: {
//     backgroundColor: "#000",
//     padding: 15,
//     alignItems: "center",
//     borderRadius: 8,
//     marginTop: 20,
//   },
// });

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:delivery_app/constants/my_colors.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  _EditProfileScreenState createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final TextEditingController firstNameController = TextEditingController(text: "David");
  final TextEditingController lastNameController = TextEditingController(text: "Gonzalez");
  final TextEditingController phoneController = TextEditingController(text: "0655482100");

  bool isMale = true;
  int selectedAge = 30; // Default age
  File? _profileImage; // To store the selected image

  final ImagePicker _picker = ImagePicker();

  // Function to show the image source modal bottom sheet
  void _showImageSourceModal() {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: Icon(Icons.photo_library, color: MyColors.primaryColor),
                title: Text("Import from Gallery"),
                onTap: () {
                  _pickImage(ImageSource.gallery);
                  Navigator.pop(context); // Close the modal
                },
              ),
              ListTile(
                leading: Icon(Icons.camera_alt, color: MyColors.primaryColor),
                title: Text("Take a Picture"),
                onTap: () {
                  _pickImage(ImageSource.camera);
                  Navigator.pop(context); // Close the modal
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // Function to pick an image from the gallery or camera
  Future<void> _pickImage(ImageSource source) async {
    final XFile? pickedFile = await _picker.pickImage(source: source);

    if (pickedFile != null) {
      setState(() {
        _profileImage = File(pickedFile.path);
      });
    }
  }

  // Function to save changes
  void _saveChanges() {
    // Validate inputs
    if (firstNameController.text.isEmpty || lastNameController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Please fill in all fields"),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Validate phone number (example: must be 10 digits)
    if (phoneController.text.length != 10 || !phoneController.text.startsWith("0")) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Please enter a valid phone number"),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Save changes (you can replace this with your logic to save to a database or state management)
    final updatedProfile = {
      "firstName": firstNameController.text,
      "lastName": lastNameController.text,
      "phone": phoneController.text,
      "gender": isMale ? "Male" : "Female",
      "age": selectedAge,
      "image": _profileImage,
    };

    // Show success message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Profile updated successfully!"),
        backgroundColor: Colors.green,
      ),
    );

    // Navigate back to the profile screen (optional)
    Navigator.pop(context, updatedProfile);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: Icon(
            Icons.arrow_back_ios_new_outlined,
            color: MyColors.whiteColor,
          ),
        ),
        backgroundColor: MyColors.primaryColor,
        toolbarHeight: 70.0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
        ),
        centerTitle: true,
        title: Text(
          "Edit Information",
          style: GoogleFonts.nunitoSans(
            fontSize: 20,
            color: Colors.white,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            Center(
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: 60,
                    backgroundImage: _profileImage != null
                        ? FileImage(_profileImage!) as ImageProvider
                        : AssetImage("assets/profile.jpg"), // Default image
                  ),
                  Positioned(
                    bottom: 5,
                    right: 5,
                    child: GestureDetector(
                      onTap: _showImageSourceModal, // Show the modal bottom sheet
                      child: CircleAvatar(
                        radius: 15,
                        backgroundColor: MyColors.primaryColor,
                        child: Icon(Icons.edit, color: Colors.white, size: 16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            _buildTextField(Icons.person, "First Name", firstNameController),
            SizedBox(height: 10),
            _buildTextField(Icons.person, "Last Name", lastNameController),
            SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.male, color: MyColors.primaryColor),
                    SizedBox(width: 5),
                    Text("Male"),
                    Radio(
                      value: true,
                      groupValue: isMale,
                      activeColor: MyColors.primaryColor,
                      onChanged: (value) {
                        setState(() {
                          isMale = true;
                        });
                      },
                    ),
                    SizedBox(width: 10),
                    Icon(Icons.female, color: Colors.pink),
                    SizedBox(width: 5),
                    Text("Female"),
                    Radio(
                      value: false,
                      groupValue: isMale,
                      activeColor: Colors.pink,
                      onChanged: (value) {
                        setState(() {
                          isMale = false;
                        });
                      },
                    ),
                  ],
                ),
                DropdownButton<int>(
                  value: selectedAge,
                  onChanged: (int? newValue) {
                    setState(() {
                      selectedAge = newValue!;
                    });
                  },
                  items: List.generate(83, (index) => 18 + index)
                      .map<DropdownMenuItem<int>>((int value) {
                    return DropdownMenuItem<int>(
                      value: value,
                      child: Text(value.toString()),
                    );
                  }).toList(),
                ),
              ],
            ),
            SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: _buildTextField(Icons.phone, "Phone", phoneController),
                ),
                SizedBox(width: 10),
                GestureDetector(
                  onTap: () {},
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: MyColors.primaryColor,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      Icons.download_done_sharp,
                      color: MyColors.whiteColor,
                      size: 24,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 150),
            ElevatedButton(
              onPressed: _saveChanges, // Call the save changes function
              style: ElevatedButton.styleFrom(
                backgroundColor: MyColors.primaryColor,
                padding: EdgeInsets.symmetric(vertical: 12, horizontal: 100),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                "Save Changes",
                style: GoogleFonts.nunitoSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(IconData icon, String hint, TextEditingController controller) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: Colors.black54),
        hintText: hint,
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}
import 'dart:io';

import 'package:delivery_app/pages/profile/delivery_apply_screen.dart';
import 'package:delivery_app/pages/profile/edit_profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:delivery_app/constants/my_colors.dart';
import 'package:delivery_app/pages/home/home_screen.dart';
import 'package:delivery_app/utils/my_navigation_bar.dart'; // Import the navigation bar

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String firstName = "David";
  String lastName = "Gonzalez";
  String phone = "0655482100";
  String gender = "Male";
  int age = 30;
  File? profileImage;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => HomeScreen()),
            );
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
          "Profile",
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
            // Profile Picture & Edit Button
            Center(
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundImage: profileImage != null
                        ? FileImage(profileImage!) as ImageProvider
                        : AssetImage("assets/profile.jpg"), // Default image
                  ),
                  SizedBox(height: 10),
                  ElevatedButton.icon(
                    onPressed: () async {
                      final updatedProfile = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => EditProfileScreen(),
                        ),
                      );

                      if (updatedProfile != null) {
                        setState(() {
                          firstName = updatedProfile["firstName"];
                          lastName = updatedProfile["lastName"];
                          phone = updatedProfile["phone"];
                          gender = updatedProfile["gender"];
                          age = updatedProfile["age"];
                          profileImage = updatedProfile["image"];
                        });
                      }
                    },
                    icon: Icon(Icons.edit, color: Colors.black),
                    label: Text(
                      "Edit Information",
                      style: GoogleFonts.nunitoSans(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),

            // Profile Info Card
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 5)],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  _profileDetail("Full Name", "$firstName $lastName", Colors.black),
                  _profileDetail("Gender", gender, MyColors.primaryColor),
                  _profileDetail("Age", age.toString(), Colors.black),
                  _profileDetail(
                    "Address",
                    "La Maquetta, Sidi Belabbas Ville",
                    Colors.blue,
                  ),
                  _profileDetail("Phone Number", phone, MyColors.primaryColor),
                  _profileDetail(
                    "Email",
                    "Davidgonzalez55@gmail.com",
                    Colors.blue,
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),

            // My Credits
            Container(
              padding: EdgeInsets.symmetric(horizontal: 18, vertical: 18),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 5)],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: Colors.grey[200],
                        child: Icon(
                          Icons.account_balance_wallet,
                          size: 28,
                          color: Colors.orange,
                        ),
                      ),
                      SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "My Credits",
                            style: GoogleFonts.nunitoSans(
                              fontSize: 16,
                              fontWeight: FontWeight.w400,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(height: 5),
                          Text(
                            "3000 Da",
                            style: GoogleFonts.nunitoSans(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: MyColors.primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  ElevatedButton(
                    onPressed: () {}, // Add functionality
                    style: ElevatedButton.styleFrom(
                      backgroundColor: MyColors.primaryColor,
                      padding: EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      "Charge Credits",
                      style: GoogleFonts.nunitoSans(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),

            // Be Delivery Button
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => DeliveryApplyScreen(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: MyColors.primaryColor,
                padding: EdgeInsets.symmetric(vertical: 10, horizontal: 100),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                "Be Delivery",
                style: GoogleFonts.nunitoSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                ),
              ),
            ),
            SizedBox(height: 20),

            // Log Out Button
            Align(
              alignment: Alignment.centerLeft,
              child: ElevatedButton.icon(
                onPressed: () {}, // Add logout functionality
                icon: Icon(Icons.logout, color: Colors.white, size: 16),
                label: Text(
                  "Log Out",
                  style: GoogleFonts.nunitoSans(
                    fontSize: 14,
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding: EdgeInsets.all(10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      // Add the bottom navigation bar here
      bottomNavigationBar: MyNavigationBar(
        selectedIndex: 4, // Set the selected index to highlight the Profile tab
      ),
    );
  }

  // Widget for displaying profile information
  Widget _profileDetail(String label, String value, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: GoogleFonts.nunitoSans(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.black54,
            ),
          ),
          Text(
            value,
            style: GoogleFonts.nunitoSans(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
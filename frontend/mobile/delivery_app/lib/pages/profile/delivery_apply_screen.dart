import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:delivery_app/constants/my_colors.dart';
import 'package:delivery_app/pages/profile/profile_screen.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class DeliveryApplyScreen extends StatefulWidget {
  const DeliveryApplyScreen({super.key});

  @override
  State<DeliveryApplyScreen> createState() => _DeliveryApplyScreenState();
}

class _DeliveryApplyScreenState extends State<DeliveryApplyScreen> {
  bool _acceptTerms = false;
  File? _nationalCardImage;
  File? _vehiclePapersImage;

  final ImagePicker _picker = ImagePicker();

  // Function to pick an image from the gallery or camera
  Future<void> _pickImage(ImageSource source, bool isNationalCard) async {
    final XFile? pickedFile = await _picker.pickImage(source: source);

    if (pickedFile != null) {
      setState(() {
        if (isNationalCard) {
          _nationalCardImage = File(pickedFile.path);
        } else {
          _vehiclePapersImage = File(pickedFile.path);
        }
      });
    }
  }

  // Function to show the image source modal bottom sheet
  void _showImageSourceModal(bool isNationalCard) {
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
                  _pickImage(ImageSource.gallery, isNationalCard);
                  Navigator.pop(context); // Close the modal
                },
              ),
              ListTile(
                leading: Icon(Icons.camera_alt, color: MyColors.primaryColor),
                title: Text("Take a Picture"),
                onTap: () {
                  _pickImage(ImageSource.camera, isNationalCard);
                  Navigator.pop(context); // Close the modal
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // Function to show the success pop-up
  void _showSuccessPopup() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.check_circle,
                size: 60,
                color: MyColors.primaryColor,
              ),
              const SizedBox(height: 20),
              Text(
                "Your Request is Passed Successfully",
                textAlign: TextAlign.center,
                style: GoogleFonts.nunitoSans(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                "Wait to analyze your request and get an answer in a short time.",
                textAlign: TextAlign.center,
                style: GoogleFonts.nunitoSans(
                  fontSize: 14,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context); // Close the pop-up
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => ProfileScreen()),
                  ); // Navigate to Profile Screen
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: MyColors.primaryColor,
                  padding: EdgeInsets.symmetric(horizontal: 40, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  "Continue",
                  style: GoogleFonts.nunitoSans(
                    fontSize: 16,
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // Check if all conditions are met to enable the Confirm button
    bool isConfirmEnabled = _nationalCardImage != null &&
        _vehiclePapersImage != null &&
        _acceptTerms;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => ProfileScreen()),
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
          "Delivery Apply",
          style: GoogleFonts.nunitoSans(
            fontSize: 20,
            color: Colors.white,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              "Take pictures To your Document to Confirm\nyour Identity",
              textAlign: TextAlign.center,
              style: GoogleFonts.nunitoSans(
                fontSize: 14,
                color: Colors.grey,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 25),
            _documentUploadTile("National Card", Icons.credit_card_outlined, _nationalCardImage, true),
            const SizedBox(height: 15),
            _documentUploadTile("Vehicule Papiers", Icons.directions_car_outlined, _vehiclePapersImage, false),
            const SizedBox(height: 20),
            Row(
              children: [
                Checkbox(
                  checkColor: MyColors.whiteColor,
                  activeColor: MyColors.primaryColor,
                  splashRadius: 1,
                  value: _acceptTerms,
                  onChanged: (bool? value) {
                    setState(() {
                      _acceptTerms = value!;
                    });
                  },
                ),
                const SizedBox(width: 5),
                Expanded(
                  child: Text(
                    "Accept our terms and conditions included in the app",
                    style: GoogleFonts.nunitoSans(
                      textStyle: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: MyColors.blackColor,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: isConfirmEnabled
                      ? MyColors.primaryColor
                      : Colors.grey, // Disable button if conditions are not met
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: EdgeInsets.symmetric(vertical: 10),
                ),
                onPressed: isConfirmEnabled
                    ? () {
                        // Show the success pop-up
                        _showSuccessPopup();
                      }
                    : null, // Disable button if conditions are not met
                child: Text(
                  "Confirm",
                  style: GoogleFonts.nunitoSans(
                    fontSize: 16,
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _documentUploadTile(String title, IconData icon, File? image, bool isNationalCard) {
    return Container(
      padding: EdgeInsets.all(10),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.black),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(icon),
              const SizedBox(width: 10),
              Text(
                title,
                style: GoogleFonts.nunitoSans(
                  fontSize: 16,
                  color: Colors.black,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          Row(
            children: [
              // Show image thumbnail or upload icon
              if (image != null)
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    image: DecorationImage(
                      image: FileImage(image),
                      fit: BoxFit.cover,
                    ),
                  ),
                )
              else
                IconButton(
                  onPressed: () {
                    _showImageSourceModal(isNationalCard);
                  },
                  icon: Icon(
                    Icons.file_upload_outlined,
                    color: MyColors.primaryColor,
                  ),
                ),
              // Show checkmark if image is uploaded
              if (image != null)
                Icon(
                  Icons.check_circle,
                  color: MyColors.primaryColor,
                  size: 20,
                ),
            ],
          ),
        ],
      ),
    );
  }
}
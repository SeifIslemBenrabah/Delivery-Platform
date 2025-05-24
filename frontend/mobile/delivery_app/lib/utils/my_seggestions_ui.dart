import 'package:delivery_app/constants/my_colors.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MySeggestionsUi extends StatelessWidget {
  const MySeggestionsUi({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 300,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: MyColors.primaryColor),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Image
          ClipRRect(
            borderRadius: BorderRadius.circular(8), // To match rounded design
            child: Image.asset(
              "assets/images/image.png",
              height: 70,
              width: 70,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 10),

          // Text Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title
                Text(
                  "Capotchino",
                  style: GoogleFonts.nunitoSans(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),

                const SizedBox(height: 2),

                // Description
                Text(
                  "Hot Coffee & Milk with a little bit of love",
                  style: GoogleFonts.nunitoSans(
                    fontSize: 10,
                    fontWeight: FontWeight.w400,
                    color: Colors.grey.shade600,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),

                const SizedBox(height: 8),

                // Bottom Row (Cafeteria Name & More Button)
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Cafeteria Name
                    Expanded(
                      child: Text(
                        "Cafeteria: La Ponthar",
                        style: GoogleFonts.nunitoSans(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),

                    // "More" Button
                    GestureDetector(
                      onTap: () {
                        // Add navigation or action here
                      },
                      child: Row(
                        children: [
                          Text(
                            "more",
                            style: GoogleFonts.nunitoSans(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: MyColors.primaryColor,
                            ),
                          ),
                          const SizedBox(width: 5),
                          ImageIcon(
                            AssetImage("assets/icons/see_all_icon.png"),
                            size: 12,
                            color: MyColors.primaryColor,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

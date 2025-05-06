import 'package:delivery_app/constants/my_colors.dart';
import 'package:delivery_app/pages/home/orders_screen.dart';
import 'package:delivery_app/utils/my_drawer.dart';
import 'package:delivery_app/utils/my_item_ui.dart';
import 'package:delivery_app/utils/my_navigation_bar.dart';
import 'package:delivery_app/utils/my_seggestions_ui.dart';
import 'package:delivery_app/utils/my_shops_ui.dart';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:ui';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isDrawerOpen = false;

  void _toggleDrawer() {
    setState(() {
      _isDrawerOpen = !_isDrawerOpen;
    });
  }

  int selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final TextEditingController searchController = TextEditingController();
    final List<Map<String, String>> categories = [
      {"title": "Drinks", "image": "assets/icons/cup_icon.png"},
      {"title": "Candy", "image": "assets/icons/cockiz.png"},
      {"title": "Food", "image": "assets/icons/pizza.png"},
      {"title": "Clothe", "image": "assets/icons/tshirt.png"},
    ];

    return Stack(
      children: [
        Scaffold(
          appBar: AppBar(
            leading: IconButton(
              onPressed: _toggleDrawer,
              icon: Icon(Icons.menu, color: MyColors.whiteColor),
            ),
            backgroundColor: MyColors.primaryColor,
            toolbarHeight: 70.0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
            ),
            actions: [
              IconButton(
                icon: Icon(Icons.list_alt_outlined, color: MyColors.whiteColor),
                onPressed: () {},
              ),
            ],
          ),
          body: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: 40,
                          child: TextField(
                            controller: searchController,
                            cursorColor: MyColors.blackColor,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(
                                borderSide: const BorderSide(
                                  color: Colors.grey,
                                ),
                                borderRadius: BorderRadius.circular(10.0),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                  color: MyColors.blackColor,
                                ),
                                borderRadius: BorderRadius.circular(10.0),
                              ),
                              hintText: "Search for shop...",
                              suffixIcon: Icon(
                                Icons.search,
                                color: MyColors.blackColor,
                              ),
                              hintStyle: GoogleFonts.nunitoSans(
                                textStyle: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.grey,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 15),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => OrdersScreen(),
                            ),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: MyColors.blackColor,
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
                  const SizedBox(height: 10),

                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: List.generate(categories.length, (index) {
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              selectedIndex = index;
                            });
                          },
                          child: MyItemUi(
                            title: categories[index]["title"]!,
                            image: categories[index]["image"]!,
                            isSelected: selectedIndex == index,
                          ),
                        );
                      }),
                    ),
                  ),
                  // Suggestions Title
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Suggestions",
                        style: GoogleFonts.nunitoSans(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),

                      Row(
                        children: [
                          Text(
                            "See All",
                            style: GoogleFonts.nunitoSans(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(width: 5),
                          ImageIcon(
                            AssetImage("assets/icons/see_all_icon.png"),
                            size: 16,
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 10),

                  // Suggestions (Horizontal Scroll)
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: List.generate(
                        5,
                        (index) => Padding(
                          padding: const EdgeInsets.only(right: 10),
                          child: MySeggestionsUi(),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "SHOPs",
                        style: GoogleFonts.nunitoSans(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Row(
                        children: [
                          Text(
                            "See All",
                            style: GoogleFonts.nunitoSans(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(width: 5),
                          ImageIcon(
                            AssetImage("assets/icons/see_all_icon.png"),
                            size: 16,
                          ),
                        ],
                      ),
                    ],
                  ),
                  MyShopsUi(),
                  MyShopsUi(),
                  MyShopsUi(),
                  MyShopsUi(),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),

          bottomNavigationBar: MyNavigationBar(
            selectedIndex:
                2, // Set the selected index to highlight the Profile tab
          ),
        ),

        // Blur effect when drawer is open
        if (_isDrawerOpen)
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
              child: Container(color: Colors.black.withOpacity(0.2)),
            ),
          ),

        // Custom Drawer
        AnimatedPositioned(
          duration: Duration(milliseconds: 300),
          left: _isDrawerOpen ? 0 : -250,
          top: 0,
          bottom: 0,
          child: CustomDrawer(onClose: _toggleDrawer),
        ),
      ],
    );
  }
}

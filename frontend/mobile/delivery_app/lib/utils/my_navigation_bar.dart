import 'package:delivery_app/constants/my_colors.dart';
import 'package:delivery_app/pages/home/home_screen.dart';
import 'package:delivery_app/pages/profile/profile_screen.dart';
import 'package:flutter/material.dart';

class MyNavigationBar extends StatefulWidget {
  final int selectedIndex; // Add selectedIndex parameter

  const MyNavigationBar({super.key, required this.selectedIndex});

  @override
  _MyNavigationBarState createState() => _MyNavigationBarState();
}

class _MyNavigationBarState extends State<MyNavigationBar> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.selectedIndex; // Initialize with the passed index
  }

  // Function to handle navigation
  void _onItemTapped(int index) {
    if (_selectedIndex == index) return; // Avoid unnecessary navigation

    setState(() {
      _selectedIndex = index;
    });

    // Define screen navigation
    Widget nextScreen;
    switch (index) {
      case 0:
        nextScreen = HomeScreen();
        break;
      case 1:
        nextScreen = HomeScreen();
        break;
      case 2:
        nextScreen = HomeScreen();
        break;
      case 3:
        nextScreen = HomeScreen();
        break;
      case 4:
        nextScreen = ProfileScreen();
        break;
      default:
        nextScreen = HomeScreen();
    }

    // Navigate to the selected screen
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => nextScreen),
    );
  }

  Widget _buildIcon(IconData icon, bool isSelected) {
    return isSelected
        ? Container(
            padding: EdgeInsets.all(5),
            decoration: BoxDecoration(
              color: Colors.white, // Background of the selected icon
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: MyColors.primaryColor),
          )
        : Icon(icon, color: Colors.white70);
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(20),
        topRight: Radius.circular(20),
      ),
      child: SizedBox(
        height: 68, // Adjust the height as needed
        child: BottomNavigationBar(
          iconSize: 24,
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          backgroundColor: MyColors.primaryColor, // Match your UI
          selectedItemColor: Colors.white,
          unselectedItemColor: Colors.white70,
          showSelectedLabels: false,
          showUnselectedLabels: false,
          type: BottomNavigationBarType.fixed,
          items: [
            BottomNavigationBarItem(
              icon: _buildIcon(Icons.settings, _selectedIndex == 0),
              label: "Settings",
            ),
            BottomNavigationBarItem(
              icon: _buildIcon(Icons.shopping_cart, _selectedIndex == 1),
              label: "Cart",
            ),
            BottomNavigationBarItem(
              icon: _buildIcon(Icons.home, _selectedIndex == 2),
              label: "Home",
            ),
            BottomNavigationBarItem(
              icon: _buildIcon(Icons.explore, _selectedIndex == 3),
              label: "Explore",
            ),
            BottomNavigationBarItem(
              icon: _buildIcon(Icons.person, _selectedIndex == 4),
              label: "Profile",
            ),
          ],
        ),
      ),
    );
  }
}
import 'dart:async';
import 'package:delivery_app/constants/my_colors.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart' as gl;
import 'package:google_fonts/google_fonts.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mp;

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  mp.MapboxMap? mapboxMapController;
  StreamSubscription? userPositionStream;
  bool _locationReady = false;
  bool _mapReady = false;
  mp.Position? _lastPosition;
  bool _showBottomSheet = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _setupPositionTracking();
    });
  }

  @override
  void dispose() {
    userPositionStream?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            mp.MapWidget(
              onMapCreated: _onMapCreated,
              styleUri: mp.MapboxStyles.SATELLITE,
            ),
            if (!_mapReady || !_locationReady)
              Container(
                color: Colors.black.withOpacity(0.7),
                child: const Center(
                  child: CircularProgressIndicator(
                    color: MyColors.primaryColor,
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.only(top: 40, left: 20),
              child: Align(
                alignment: Alignment.topLeft,
                child: GestureDetector(
                  onTap: () {
                    Navigator.pop(context);
                  },
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(
                      Icons.arrow_back_ios_new_outlined,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),

            // Bottom Delivery Container
            Align(
              alignment: Alignment.bottomCenter,
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _showBottomSheet
                    ? Container(
                        key: const ValueKey("visible"),
                        width: double.infinity,
                        padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                            colors: [Colors.white, Colors.greenAccent],
                          ),
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(25),
                            topRight: Radius.circular(25),
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black26,
                              blurRadius: 10,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Center(
                              child: IconButton(
                                icon: const Icon(Icons.keyboard_arrow_down),
                                onPressed: () {
                                  setState(() {
                                    _showBottomSheet = false;
                                  });
                                },
                              ),
                            ),
                            Row(
                              children: [
                                const Icon(Icons.location_on, color: Colors.green),
                                const SizedBox(width: 8),
                                Text(
                                  "Delivery location :",
                                  style: GoogleFonts.nunitoSans(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const Spacer(),
                                Text(
                                  "Rue Lieutenant Abdelkrim",
                                  style: GoogleFonts.nunitoSans(),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.timer, color: Colors.blue),
                                const SizedBox(width: 8),
                                Text(
                                  "Time to drop :",
                                  style: GoogleFonts.nunitoSans(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const Spacer(),
                                Text(
                                  "00:15:20",
                                  style: GoogleFonts.nunitoSans(),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  "Order Peaked Up",
                                  style: GoogleFonts.nunitoSans(
                                    color: MyColors.primaryColor,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(5),
                                      decoration: BoxDecoration(
                                        color: MyColors.primaryColor,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Icon(
                                        Icons.phone,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 5),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(color: Colors.red, width: 0.5),
                                      ),
                                      child: Text(
                                        "Cancel",
                                        style: GoogleFonts.nunitoSans(
                                          color: Colors.red,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      )
                    : GestureDetector(
                        key: const ValueKey("hidden"),
                        onTap: () {
                          setState(() {
                            _showBottomSheet = true;
                          });
                        },
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          margin: const EdgeInsets.only(bottom: 12),
                          decoration: BoxDecoration(
                            color: Colors.black87,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(
                            Icons.keyboard_arrow_up,
                            color: Colors.white,
                          ),
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _onMapCreated(mp.MapboxMap controller) {
    mapboxMapController = controller;
    _mapReady = true;

    mapboxMapController?.location.updateSettings(
      mp.LocationComponentSettings(enabled: true, pulsingEnabled: true),
    );

    if (_lastPosition != null) {
      mapboxMapController?.setCamera(
        mp.CameraOptions(
          center: mp.Point(coordinates: _lastPosition!),
          zoom: 15,
        ),
      );
    }

    if (_locationReady) {
      setState(() {});
    }
  }

  Future<void> _setupPositionTracking() async {
    bool serviceEnabled = await gl.Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return;

    gl.LocationPermission permission = await gl.Geolocator.checkPermission();
    if (permission == gl.LocationPermission.denied) {
      permission = await gl.Geolocator.requestPermission();
    }

    if (permission == gl.LocationPermission.denied ||
        permission == gl.LocationPermission.deniedForever) {
      return;
    }

    final position = await gl.Geolocator.getCurrentPosition();
    _lastPosition = mp.Position(position.longitude, position.latitude);

    setState(() {
      _locationReady = true;
    });

    if (_mapReady && mapboxMapController != null) {
      mapboxMapController?.setCamera(
        mp.CameraOptions(
          center: mp.Point(coordinates: _lastPosition!),
          zoom: 15,
        ),
      );
    }

    gl.LocationSettings locationSettings = gl.LocationSettings(
      accuracy: gl.LocationAccuracy.high,
      distanceFilter: 200,
    );

    userPositionStream?.cancel();
    userPositionStream = gl.Geolocator.getPositionStream(
      locationSettings: locationSettings,
    ).listen((gl.Position? position) {
      if (position != null) {
        _lastPosition = mp.Position(position.longitude, position.latitude);
        if (mapboxMapController != null) {
          mapboxMapController?.setCamera(
            mp.CameraOptions(
              center: mp.Point(coordinates: _lastPosition!),
              zoom: 15,
            ),
          );
        }
      }
    });
  }
}

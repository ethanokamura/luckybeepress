import 'package:app_core/app_core.dart';

/// Object mapping for [Boards]
/// Defines helper functions to help with bidirectional mapping
class Boards extends Equatable {
  /// Constructor for [Boards]
  /// Requires default values for non-nullable data
  const Boards({
    this.boardId = '',
    this.creatorId = '',
    this.name = '',
    this.description = '',
    this.inviteCode = '',
    this.photoUrl = '',
    this.isPublic = false,
    this.isPremium = false,
    this.lastActivityAt,
    this.createdAt,
    this.updatedAt,
  });

  // Helper function that converts a single SQL object to our dart object
  factory Boards.converterSingle(Map<String, dynamic> data) {
    return Boards.fromJson(data);
  }

  // Helper function that converts a JSON object to our dart object
  factory Boards.fromJson(Map<String, dynamic> json) {
    return Boards(
      boardId: json[boardIdConverter]?.toString() ?? '',
      creatorId: json[creatorIdConverter]?.toString() ?? '',
      name: json[nameConverter]?.toString() ?? '',
      description: json[descriptionConverter]?.toString() ?? '',
      inviteCode: json[inviteCodeConverter]?.toString() ?? '',
      photoUrl: json[photoUrlConverter]?.toString() ?? '',
      isPublic: Boards._parseBool(json[isPublicConverter]),
      isPremium: Boards._parseBool(json[isPremiumConverter]),
      lastActivityAt: json[lastActivityAtConverter] != null
          ? DateTime.tryParse(json[lastActivityAtConverter].toString())
                  ?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
      createdAt: json[createdAtConverter] != null
          ? DateTime.tryParse(json[createdAtConverter].toString())?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
      updatedAt: json[updatedAtConverter] != null
          ? DateTime.tryParse(json[updatedAtConverter].toString())?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
    );
  }

  // JSON string equivalent for our data
  static String get boardIdConverter => 'board_id';
  static String get creatorIdConverter => 'creator_id';
  static String get nameConverter => 'name';
  static String get descriptionConverter => 'description';
  static String get inviteCodeConverter => 'invite_code';
  static String get photoUrlConverter => 'photo_url';
  static String get isPublicConverter => 'is_public';
  static String get isPremiumConverter => 'is_premium';
  static String get lastActivityAtConverter => 'last_activity_at';
  static String get createdAtConverter => 'created_at';
  static String get updatedAtConverter => 'updated_at';

  // Defines the empty state for the Boards
  static const empty = Boards();

  // Data for Boards
  final String boardId;
  final String creatorId;
  final String name;
  final String description;
  final String inviteCode;
  final String photoUrl;
  final bool isPublic;
  final bool isPremium;
  final DateTime? lastActivityAt;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Defines object properties
  @override
  List<Object?> get props => [
        boardId,
        creatorId,
        name,
        description,
        inviteCode,
        photoUrl,
        isPublic,
        isPremium,
        lastActivityAt,
        createdAt,
        updatedAt,
      ];

  // Helper function that converts a list of SQL objects to a list of our dart objects
  static List<Boards> converter(List<Map<String, dynamic>> data) {
    return data.map(Boards.fromJson).toList();
  }

  // Generic function to map our dart object to a JSON object
  Map<String, dynamic> toJson() {
    return _generateMap(
      boardId: boardId,
      creatorId: creatorId,
      name: name,
      description: description,
      inviteCode: inviteCode,
      photoUrl: photoUrl,
      isPublic: isPublic,
      isPremium: isPremium,
      lastActivityAt: lastActivityAt,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // Generic function to generate a generic mapping between objects
  static Map<String, dynamic> _generateMap({
    String? boardId,
    String? creatorId,
    String? name,
    String? description,
    String? inviteCode,
    String? photoUrl,
    bool? isPublic,
    bool? isPremium,
    DateTime? lastActivityAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return {
      if (boardId != null) boardIdConverter: boardId,
      if (creatorId != null) creatorIdConverter: creatorId,
      if (name != null) nameConverter: name,
      if (description != null) descriptionConverter: description,
      if (inviteCode != null) inviteCodeConverter: inviteCode,
      if (photoUrl != null) photoUrlConverter: photoUrl,
      if (isPublic != null) isPublicConverter: isPublic,
      if (isPremium != null) isPremiumConverter: isPremium,
      if (lastActivityAt != null)
        lastActivityAtConverter: lastActivityAt.toIso8601String(),
      if (createdAt != null) createdAtConverter: createdAt.toIso8601String(),
      if (updatedAt != null) updatedAtConverter: updatedAt.toIso8601String(),
    };
  }

  // Helper function to safely parse boolean values, handling various input types
  static bool _parseBool(dynamic value) {
    if (value == null) {
      return false;
    }
    if (value is bool) {
      return value;
    }
    if (value is String) {
      return value.toLowerCase() == 'true';
    }
    if (value is int) {
      return value != 0;
    }
    return false;
  }
}

// Extensions to the object allowing a public getters
extension BoardsExtensions on Boards {
  // Check if object is currently empty
  bool get isEmpty => this == Boards.empty;
}

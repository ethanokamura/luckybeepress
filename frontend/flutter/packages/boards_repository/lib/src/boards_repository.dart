import 'package:api_client/api_client.dart';
import 'models/boards.dart';
import 'failures.dart';

/// Repository class for managing Boards data with caching and error handling
class BoardsRepository extends BaseRepository<Boards> {
  BoardsRepository() : super(GetIt.instance<CacheManager>());

  @override
  String get entityName => 'boards';

  @override
  Boards fromJson(Map<String, dynamic> json) => Boards.fromJson(json);

  @override
  String getCacheKeyForId(String id) => generateCacheKey({
        'object': 'boards',
        'board_id': id,
      });

  @override
  Exception createFailure(String operation, {dynamic error}) {
    // Map status codes to specific failure types
    final statusCode = _extractStatusCode(error);

    if (statusCode != null) {
      switch (statusCode) {
        case 401:
          return BoardsFailure.unauthorized();
        case 404:
          return BoardsFailure.notFound();
        case 400:
          return BoardsFailure.validation(
            'Invalid board data',
            _extractErrorDetails(error),
          );
        case >= 500:
          return BoardsFailure(
            message: 'Server error occurred',
            type: FailureType.serverError,
            statusCode: statusCode,
          );
      }
    }

    // Default failures based on operation
    switch (operation) {
      case 'create':
        return BoardsFailure.fromCreate(null, error);
      case 'get':
        return BoardsFailure.fromGet(null, error);
      case 'update':
        return BoardsFailure.fromUpdate(null, error);
      case 'delete':
        return BoardsFailure.fromDelete(null, error);
      default:
        return BoardsFailure.fromGet(null, error);
    }
  }

  //////////// CRUD Operations ////////////

  /// Create a new board
  Future<Boards> createBoards({
    required Map<String, dynamic> data,
  }) async {
    try {
      final board = await create(data: data);

      // Cache with the proper key after creation
      final cacheKey = getCacheKeyForId(board.boardId);
      await cacheResponse(cacheKey, board.toJson());

      return board;
    } catch (e) {
      if (e is BoardsFailure) rethrow;
      throw BoardsFailure.fromCreate(null, e);
    }
  }

  /// Fetch a single board by ID
  Future<Boards> fetchBoardsWithBoardsId({
    required String boardId,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchById(
        id: boardId,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is BoardsFailure) rethrow;
      throw BoardsFailure.fromGet(null, e);
    }
  }

  /// Fetch a paginated list of boards
  Future<PaginatedResponse<Boards>> fetchBoardsList({
    String sortBy = '',
    bool ascending = false,
    int limit = 25,
    List<Filter> filters = const [],
    String? cursor,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchList(
        sortBy: sortBy.isEmpty ? Boards.createdAtConverter : sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
        cursor: cursor,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is BoardsFailure) rethrow;
      throw BoardsFailure.fromGet(null, e);
    }
  }

  /// Fetch boards for the current member
  Future<PaginatedResponse<Boards>> fetchBoardsListForMember({
    String sortBy = '',
    bool ascending = false,
    int limit = 25,
    List<Filter> filters = const [],
    String? cursor,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchList(
        sortBy: sortBy.isEmpty ? Boards.createdAtConverter : sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
        cursor: cursor,
        forceRefresh: forceRefresh,
        customEndpoint: 'boards/memberships',
      );
    } catch (e) {
      if (e is BoardsFailure) rethrow;
      throw BoardsFailure.fromGet(null, e);
    }
  }

  /// Update a board
  Future<Boards> updateBoards({
    required String boardId,
    required Map<String, dynamic> data,
  }) async {
    try {
      return await update(
        id: boardId,
        data: data,
      );
    } catch (e) {
      if (e is BoardsFailure) rethrow;
      throw BoardsFailure.fromUpdate(null, e);
    }
  }

  /// Delete a board
  Future<void> deleteBoards({
    required String boardId,
  }) async {
    try {
      await delete(id: boardId);
    } catch (e) {
      if (e is BoardsFailure) rethrow;
      throw BoardsFailure.fromDelete(null, e);
    }
  }

  //////////// Cache Management ////////////

  /// Invalidate cache for a specific board
  Future<void> invalidateBoardsCache(String boardId) async {
    await invalidateCache(boardId);
  }

  /// Refresh a board's data
  Future<Boards> refreshBoards(String boardId) async {
    await invalidateBoardsCache(boardId);
    return fetchBoardsWithBoardsId(
      boardId: boardId,
      forceRefresh: true,
    );
  }

  //////////// Helper Methods ////////////

  int? _extractStatusCode(dynamic error) {
    if (error is Map<String, dynamic>) {
      return error['statusCode'] as int?;
    }
    return null;
  }

  Map<String, dynamic>? _extractErrorDetails(dynamic error) {
    if (error == null) return null;
    if (error is Map<String, dynamic>) return error;
    if (error is String) return {'error': error};
    return {'error': error.toString()};
  }
}

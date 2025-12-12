part of 'addresses_cubit.dart';

/// Represents the different states a post can be in.
enum AddressesStatus {
  initial,
  loading,
  loaded,
  failure,
}

/// Represents the state of post-related operations.
final class AddressesState extends Equatable {
  /// Private constructor for creating [AddressesState] instances.
  const AddressesState._({
    this.status = AddressesStatus.initial,
    this.addresses = Addresses.empty,
    this.addressesList = const [],
    this.count = 0,
    this.hasNextPage = false,
    this.cursor,
    this.pages = const [null],
    this.pageNumber = 0,
    this.sortBy = '',
    this.ascending = false,
    this.filters = const [],
    this.limit = 25,
    this.failure,
  });

  /// Creates an initial [AddressesState].
  const AddressesState.initial() : this._();

  final AddressesStatus status;
  final Addresses addresses;
  final List<Addresses> addressesList;
  final int count;
  final bool hasNextPage;
  final String? cursor;
  final List<String?> pages;
  final int pageNumber;
  final String sortBy;
  final bool ascending;
  final int limit;
  final List<Filter> filters;
  final AddressesFailure? failure;

  // Rebuilds the widget when the props change
  @override
  List<Object?> get props => [
        status,
        addresses,
        addressesList,
        count,
        hasNextPage,
        cursor,
        pages,
        pageNumber,
        sortBy,
        ascending,
        limit,
        filters,
        failure,
      ];

  /// Creates a new [AddressesState] with updated fields.
  /// Any parameter that is not provided will retain its current value.
  AddressesState copyWith({
    AddressesStatus? status,
    Addresses? addresses,
    List<Addresses>? addressesList,
    int? count,
    bool? hasNextPage,
    String? cursor,
    List<String?>? pages,
    int? pageNumber,
    String? sortBy,
    bool? ascending,
    int? limit,
    List<Filter>? filters,
    AddressesFailure? failure,
  }) {
    return AddressesState._(
      status: status ?? this.status,
      addresses: addresses ?? this.addresses,
      count: count ?? this.count,
      cursor: cursor ?? this.cursor,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      pages: pages ?? this.pages,
      pageNumber: pageNumber ?? this.pageNumber,
      sortBy: sortBy ?? this.sortBy,
      ascending: ascending ?? this.ascending,
      limit: limit ?? this.limit,
      filters: filters ?? this.filters,
      addressesList: addressesList ?? this.addressesList,
      failure: failure ?? this.failure,
    );
  }
}

/// Extension methods for convenient state checks.
extension AddressesStateExtensions on AddressesState {
  bool get isLoaded => status == AddressesStatus.loaded;
  bool get isLoading => status == AddressesStatus.loading;
  bool get isFailure => status == AddressesStatus.failure;
}

/// Extension methods for creating new [AddressesState] instances.
extension _AddressesStateExtensions on AddressesState {
  AddressesState fromLoading() => copyWith(status: AddressesStatus.loading);
  AddressesState fromLoaded() => copyWith(status: AddressesStatus.loaded);
  AddressesState fromAddressesLoaded({required Addresses addresses}) =>
      copyWith(
        status: AddressesStatus.loaded,
        addresses: addresses,
      );

  AddressesState fromPaginatedAddressesLoaded({
    required PaginatedResponse<Addresses> paginatedResult,
    required int newPageNumber,
  }) =>
      copyWith(
        status: AddressesStatus.loaded,
        addressesList: paginatedResult.data,
        hasNextPage: paginatedResult.hasNextPage,
        cursor: paginatedResult.nextCursor,
        pages: newPageNumber >= pageNumber && newPageNumber >= pages.length - 1
            ? (List.of(pages)..add(paginatedResult.nextCursor))
            : pages,
        pageNumber: newPageNumber,
      );

  AddressesState fromAddressesFailure(AddressesFailure failure) => copyWith(
        status: AddressesStatus.failure,
        failure: failure,
      );
}

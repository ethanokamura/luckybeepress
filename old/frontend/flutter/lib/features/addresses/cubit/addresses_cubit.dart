import 'package:api_client/api_client.dart';
import 'package:app_core/app_core.dart';
import 'package:addresses_repository/addresses_repository.dart';

part 'addresses_state.dart';

class AddressesCubit extends Cubit<AddressesState> {
  AddressesCubit({
    required AddressesRepository repository,
  })  : _repository = repository,
        super(const AddressesState.initial());

  final AddressesRepository _repository;

  void setFilters({
    String? sortBy,
    bool? ascending,
    int? limit,
    List<Filter>? filters,
  }) =>
      emit(state.copyWith(
        sortBy: sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
      ));

  Future<void> createAddresses({
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      data.removeWhere(
        (key, value) => value.toString().isEmpty || value == null,
      );
      final addresses = await _repository.createAddresses(data: data);

      emit(state.fromAddressesLoaded(addresses: addresses));
    } on AddressesFailure catch (failure) {
      emit(state.fromAddressesFailure(failure));
    }
  }

  Future<void> fetchAddressesWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final addresses = await _repository.fetchAddressesWithId(
        id: id,
        forceRefresh: forceRefresh,
      );
      emit(state.fromAddressesLoaded(addresses: addresses));
    } on AddressesFailure catch (failure) {
      emit(state.fromAddressesFailure(failure));
    }
  }

  Future<void> fetchAddressesList({
    required int pageNumber,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final paginatedResult = await _repository.fetchAddressesList(
        sortBy: state.sortBy,
        ascending: state.ascending,
        limit: state.limit,
        filters: state.filters,
        cursor: forceRefresh ? null : state.cursor,
        forceRefresh: forceRefresh,
      );
      emit(state.fromPaginatedAddressesLoaded(
        paginatedResult: paginatedResult,
        newPageNumber: pageNumber,
      ));
    } on AddressesFailure catch (failure) {
      emit(state.fromAddressesFailure(failure));
    }
  }

  Future<void> updateAddresses({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      final addresses = await _repository.updateAddresses(
        id: id,
        data: data,
      );
      emit(state.fromAddressesLoaded(addresses: addresses));
    } on AddressesFailure catch (failure) {
      emit(state.fromAddressesFailure(failure));
    }
  }

  Future<void> deleteAddresses({
    required String id,
  }) async {
    emit(state.fromLoading());
    try {
      await _repository.deleteAddresses(id: id);
      emit(state.fromLoaded());
    } on AddressesFailure catch (failure) {
      emit(state.fromAddressesFailure(failure));
    }
  }
}

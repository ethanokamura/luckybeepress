import 'package:api_client/api_client.dart';
import 'package:app_core/app_core.dart';
import 'package:customers_repository/customers_repository.dart';

part 'customers_state.dart';

class CustomersCubit extends Cubit<CustomersState> {
  CustomersCubit({
    required CustomersRepository repository,
  })  : _repository = repository,
        super(const CustomersState.initial());

  final CustomersRepository _repository;

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

  Future<void> createCustomers({
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      data.removeWhere(
        (key, value) => value.toString().isEmpty || value == null,
      );
      final customers = await _repository.createCustomers(data: data);

      emit(state.fromCustomersLoaded(customers: customers));
    } on CustomersFailure catch (failure) {
      emit(state.fromCustomersFailure(failure));
    }
  }

  Future<void> fetchCustomersWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final customers = await _repository.fetchCustomersWithId(
        id: id,
        forceRefresh: forceRefresh,
      );
      emit(state.fromCustomersLoaded(customers: customers));
    } on CustomersFailure catch (failure) {
      emit(state.fromCustomersFailure(failure));
    }
  }

  Future<void> fetchCustomersList({
    required int pageNumber,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final paginatedResult = await _repository.fetchCustomersList(
        sortBy: state.sortBy,
        ascending: state.ascending,
        limit: state.limit,
        filters: state.filters,
        cursor: forceRefresh ? null : state.cursor,
        forceRefresh: forceRefresh,
      );
      emit(state.fromPaginatedCustomersLoaded(
        paginatedResult: paginatedResult,
        newPageNumber: pageNumber,
      ));
    } on CustomersFailure catch (failure) {
      emit(state.fromCustomersFailure(failure));
    }
  }

  Future<void> updateCustomers({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      final customers = await _repository.updateCustomers(
        id: id,
        data: data,
      );
      emit(state.fromCustomersLoaded(customers: customers));
    } on CustomersFailure catch (failure) {
      emit(state.fromCustomersFailure(failure));
    }
  }

  Future<void> deleteCustomers({
    required String id,
  }) async {
    emit(state.fromLoading());
    try {
      await _repository.deleteCustomers(id: id);
      emit(state.fromLoaded());
    } on CustomersFailure catch (failure) {
      emit(state.fromCustomersFailure(failure));
    }
  }
}

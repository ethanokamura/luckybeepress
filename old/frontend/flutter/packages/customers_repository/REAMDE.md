# Customers Repository

This repository provides the core logic and data interactions for the **`Customers`** domain within our application. It acts as an abstraction layer, handling all necessary communication with our backend services and the **RDS database** to manage `Customers`-related data.

By centralizing `GET` methods and other data operations here, we ensure a consistent and robust approach to data retrieval and manipulation for `Customers`.

---

## Key Responsibilities

* **Data Abstraction:** Isolates the frontend (via Cubits) from the complexities of direct API calls and database interactions.
* **RDS Database Interaction:** Leverages our custom **RDS SDK** to fetch and manage data related to `Customers`.
* **Backend Communication:** Primarily handles `GET` requests to our NodeJS backend, ensuring efficient data retrieval.
* **Error Handling:** Defines specific **failures** for `Customers` operations, allowing for robust error management in the frontend.

---

## Core Components

This package defines the following publicly accessible classes and their associated functionality:


These models are the building blocks for how `Customers` data is structured and used throughout the application.

---

## Project Structure

```
customers_repository/
	├── lib/
  │    ├── src/
  │    │    ├── models/                      # Data entities
  │    │    ├── customers_repository.dart  # Repository implementation
  │    │    └── failures.dart                # Custom failure definitions for this domain
  │    │
  │    └── customers_repository.dart  # Exports the repository as a consumable library
  │
	├── analysis_options.yaml    # `very_good_analysis` config for linting rules
	├── devtools_options.yaml  # Dart tooling settings
	├── pubspec.yaml           # Package dependencies and metadata
	└── README.md              # This description of the repository
```

---

## Usage

To use this repository in the main Flutter application:

1.  Add it to the main `pubspec.yaml`:
    ```yaml
    dependencies:
        customers_repository:
            path: packages/customers_repository
    ```
2.  Run `flutter pub get`
3.  Inject the `CustomersRepository()` into Cubits or other service layers.
4.  **Access methods** like `fetchCustomers()`, `fetchCustomersWithId(id)`, etc., to interact with `Customers` data.

---
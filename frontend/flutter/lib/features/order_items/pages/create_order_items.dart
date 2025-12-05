import 'package:bento_labs/features/order_items/order_items.dart';
import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';

const List<String> nonNull = [
  'order_id',
  'product_id',
  'sku',
  'product_name',
  'quantity',
  'unit_wholesale_price',
  'subtotal',
];

class CreateOrderItemsPage extends AppStatefulWidget {
  const CreateOrderItemsPage({super.key});

  @override
  State<CreateOrderItemsPage> createState() => _CreateOrderItemsPageState();
}

class _CreateOrderItemsPageState extends State<CreateOrderItemsPage> {
  final controllers = List<TextEditingController>.generate(
    nonNull.length,
    (_) => TextEditingController(),
  );

  final values = List<String>.generate(nonNull.length, (_) => '');

  String? validationError;
  void _validateField(String label, String value, int index) {
    setState(() {
      if (value.isEmpty) {
        validationError = 'Subject is required';
      } else {
        validationError = null;
        values[index] = value;
      }
    });
  }

  Map<String, dynamic> _generateJson() {
    Map<String, dynamic> data = {};
    for (int i = 0; i < nonNull.length; i++) {
      data[nonNull[i]] = values[i];
    }
    return data;
  }

  @override
  void dispose() {
    controllers.map((controller) => controller.dispose());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppPage(
      title: 'OrderItems Management',
      body: AppList(
        child: Column(
          children: [
            AppCard(
              child: AppColumn(
                children: [
                  AppHeading.h3('OrderItems Values'),
                  ...List.generate(
                    nonNull.length,
                    (index) => AppTextField(
                      semanticLabel:
                          '${nonNull[index].replaceAll('_', '-')}-input',
                      key: ObjectKey(nonNull[index]),
                      controller: controllers[index],
                      label: nonNull[index].replaceAll('_', ' ').toTitleCase,
                      placeholder: 'Enter value',
                      onChanged: (value) => _validateField(
                        nonNull[index].replaceAll('_', ' ').toTitleCase,
                        value,
                        index,
                      ),
                      validationState: validationError != null
                          ? ValidationState.invalid
                          : ValidationState.none,
                      errorText: validationError,
                    ),
                  ),
                  AppSpacer(),
                  AppButton(
                      semanticLabel: 'create-order-items',
                      text: 'Create',
                      onPressed: () async {
                        try {
                          await BlocProvider.of<OrderItemsCubit>(context)
                              .createOrderItems(
                            data: _generateJson(),
                          );
                          if (!context.mounted) return;
                          AppSnackbar.show(
                            context: context,
                            message: 'Created a users!',
                          );
                          Navigator.pop(context);
                        } catch (e) {
                          if (!context.mounted) return;
                          AppSnackbar.showError(
                            context: context,
                            message: 'Failed to create a order items',
                          );
                        }
                      }),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

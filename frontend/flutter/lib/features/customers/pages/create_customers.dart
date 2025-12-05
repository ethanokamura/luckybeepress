import 'package:bento_labs/features/customers/customers.dart';
import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';

const List<String> nonNull = [
  'business_name',
  'email',
];

class CreateCustomersPage extends AppStatefulWidget {
  const CreateCustomersPage({super.key});

  @override
  State<CreateCustomersPage> createState() => _CreateCustomersPageState();
}

class _CreateCustomersPageState extends State<CreateCustomersPage> {
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
      title: 'Customers Management',
      body: AppList(
        child: Column(
          children: [
            AppCard(
              child: AppColumn(
                children: [
                  AppHeading.h3('Customers Values'),
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
                      semanticLabel: 'create-customers',
                      text: 'Create',
                      onPressed: () async {
                        try {
                          await BlocProvider.of<CustomersCubit>(context)
                              .createCustomers(
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
                            message: 'Failed to create a customers',
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

import 'package:bento_labs/app/cubit/authentication_cubit.dart';
import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  static MaterialPage<dynamic> page() =>
      const MaterialPage<void>(child: LoginPage());

  @override
  Widget build(BuildContext context) {
    final state = BlocProvider.of<AuthenticationCubit>(context).state;
    return Scaffold(
      body: Column(
        children: [
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                AppSpacer.lg(),
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    borderRadius: context.radius.borderMd,
                    image: DecorationImage(
                      image: AssetImage('/assets/logo.png'),
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
                AppSpacer.lg(),
                AppHeading.h2('Welcome!'),
                AppText('Log in to start your adventure!'),
                AppSpacer.lg(),
                SizedBox(
                  width: 256,
                  child: AppButton(
                    text: state.isLoading ? 'One Moment' : 'Login',
                    onPressed: state.isLoading
                        ? null
                        : () async => BlocProvider.of<AuthenticationCubit>(
                              context,
                            ).login(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

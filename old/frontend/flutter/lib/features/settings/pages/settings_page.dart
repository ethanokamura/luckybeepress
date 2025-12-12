import 'package:bento_labs/app/cubit/authentication_cubit.dart';
import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'package:credentials_repository/credentials_repository.dart';
import 'package:go_router/go_router.dart';

class SettingsPage extends AppWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final userProfile = context.read<CredentialsRepository>().currentUser;
    return AppPage(
      leading: AppIconButton(
        icon: Icons.arrow_back_ios,
        onPressed: () => context.pop(),
      ),
      title: 'Settings',
      centerTitle: false,
      body: AppList(
        child: AppColumn(
          gap: SpacingSize.md,
          children: [
            AppRow(
              children: [
                AppAvatar(
                  imageUrl: userProfile?.pictureUrl.toString(),
                  size: AvatarSize.large,
                  borderColor: context.colors.primary,
                  borderWidth: 0,
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AppHeading.h3('@${userProfile?.nickname}'),
                    AppText(userProfile?.email ?? 'unknown@example.com'),
                  ],
                ),
              ],
            ),
            AppButton(
              semanticLabel: 'theme-button',
              onPressed: () => AppThemeScope.of(context).toggleTheme(),
              text: AppThemeScope.of(context).isDarkMode
                  ? 'Dark Mode'
                  : 'Light Mode',
              // variant: ButtonVariant.surface,
              icon: Icons.brightness_6,
            ),
            AppButton(
              semanticLabel: 'logut-button',
              onPressed: () async {
                await BlocProvider.of<AuthenticationCubit>(context).logout();
                if (!context.mounted) return;
                Navigator.pop(context);
              },
              text: 'Logout',
              variant: ButtonVariant.outline,
              icon: Icons.logout,
            ),
          ],
        ),
      ),
    );
  }
}

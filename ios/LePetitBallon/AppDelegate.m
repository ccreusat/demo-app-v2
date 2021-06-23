/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <UserNotifications/UserNotifications.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNString.h"

#import <DIAnalytics/DIAnalytics.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"LePetitBallon"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
    
  NSString *savedValue = [[NSUserDefaults standardUserDefaults] stringForKey:@"username"];
  NSLog(@"Greeting message: %@\n", savedValue );
  //NSString *savedValue = @"yannick@lepetitballon.com";
  if(savedValue) {
    NSLog(@"Inside if condition: %@\n", savedValue );
    [[[DIAnalytics setLogEnabled:YES] setBaseUrl:@"https://app.mydialoginsight.com"] startWithApplicationId:@"172:6tGqLZMZF0mgVrdpcbNeTe8ZcKIMiNgw" withLaunchOptions:launchOptions];
     /* statement(s) will execute if the boolean expression is true */
  
      NSMutableDictionary *customFieldsDictionary = [[NSMutableDictionary alloc] init];
      [customFieldsDictionary setObject:savedValue forKey:@"f_EMail"];
  
      NSDictionary *contactDictionary = [[NSDictionary alloc] initWithObjectsAndKeys:customFieldsDictionary, @"contact", nil];

      [DIAnalytics identify:contactDictionary];
      [application registerForRemoteNotifications];
    
    if ([UNUserNotificationCenter class] != nil) {
      // iOS 10 or later
      // For iOS 10 display notification (sent via APNS)
      [UNUserNotificationCenter currentNotificationCenter].delegate = self;
      UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
          UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
      [[UNUserNotificationCenter currentNotificationCenter]
          requestAuthorizationWithOptions:authOptions
          completionHandler:^(BOOL granted, NSError * _Nullable error) {
            // ...
            [DIAnalytics registeForRemoteNotification];
          }];
    }
  }
  
  // Place this code after "[self.window makeKeyAndVisible]" and before "return YES;"
  UIView* launchScreenView = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] objectAtIndex:0];
  launchScreenView.frame = self.window.bounds;
  rootView.loadingView = launchScreenView;
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    [DIAnalytics handleDidReceiveRemoteNotification:userInfo];

    if (application.applicationState == UIApplicationStateActive ) {
        NSLog(@"Application is in foreground when it received the notification, application should handle display of notification.");
    }
}

//For iOS under 10, you must implement these two methods to register for a token
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    NSLog(@"Unable to register for remote notifications: %@", error);
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [DIAnalytics handleDidRegisterForRemoteNotificationWithDeviceToken:deviceToken];
}

@end

//
//  DIAnalytics.h
//  Pods
//
//  Created by Samuel Cote on 2016-10-31.
//
//

#import <Foundation/Foundation.h>

#ifndef _DIAnalytics_
    #define _DIAnalytics_

    #import "DIResponse.h"
    #import <UserNotifications/UserNotifications.h>
    #import <Firebase/Firebase.h>

#endif

@interface DIAnalytics : NSObject

-(instancetype) __unavailable init;
+(instancetype) __unavailable new;

/**
 Version of the DIAnalytics library
 
 @return version NSString
 */
+(NSString*)libraryVersion;

/**
 
 This is an optional method to override default Dialog Insight Mode.
 This fields must be set before "startWithApplicationId" was called, otherwise, it has no effet.
 
 @param logEnabled BOOL that specifies whether log is enabled(YES) or not(NO). Default value: NO
 
 */
+(Class)setLogEnabled:(BOOL)logEnabled;

/**
 
 This is a method to know if console log is enabled.
 
 */
+(BOOL)isLogEnabled;

/**
 
 This is an optional method to override default Dialog Insight URL.
 This fields must be set before "startWithApplicationId" was called, otherwise, it has no effet.
 
 @param baseURL NSString of url to use, must be include https. Example (and default value) : @"https://ofsys.com/S/PushNotification/"
 
 */
+(Class)setBaseUrl:(NSString*)baseURL;

/**
 
 This is a method to to get base url.
 
 @return baseURL NSString of url to use, must be include https. Example (and default value) : @"https://ofsys.com/S/PushNotification/"
 
 */
+(NSString*)baseUrl;

/**
 
 Initialize DIAnalytics
 This must be called in the scope of @c applicationDidFinishLaunching.
 
 @param applicationId NSString provide by Dialog Insight that identifie mobile application. If equal to @"", library do nothing (and no crash)
 
 */
+(Class)startWithApplicationId:(NSString*)applicationId withLaunchOptions:(NSDictionary *)launchOptions;

/**
 
 Identify
 Send information about contact to Dialog Insight server.
 This method must be call after "startWithApplicationId" was called.
 
 @param clientFields NSDictionary of additionnal information
 
 */
+(Class)identify:(NSDictionary*)clientFields;

/**
 
 Send push reception
 For demo purpose. This method is automatically called when a remote notification is received.
 This method sends the push ID of a notification.
 
 @param pushId NSString of additionnal information
 
 */
+(void)sendPushReception:(NSString*)pushId;

/**
 
 Register for remote notification
 This method will prompt to user a alert dialog asking for notification permission
 This method must be call after "startWithApplicationId" was called.
 You should not disable swizzling
 
 By default: Alert | Sound | Badge;
 
 */
+(void)registeForRemoteNotification;

/**
 
 Notify Dialog Insight server that remote notification is received
 This It must be implement in your AppDelegate on method "didReceiveRemoteNotification".
 
 @param userInfo NSDictionary provide information about remote notification received
 
 */
+(void)handleDidReceiveRemoteNotification:(NSDictionary *)userInfo;

/**
 
 Handle receive new token for pre iOS10
 This It must be implement in your AppDelegate on method "didRegisterForRemoteNotificationsWithDeviceToken".
 
 @param deviceToken NSData provide information about remote notification token
 
 */
+(void)handleDidRegisterForRemoteNotificationWithDeviceToken:(NSData*)deviceToken;

/**
 
 This is a method to log.
 
 */
+(void)log:(NSString *)logString;

@end

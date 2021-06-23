//
//  RNString.m
//  LePetitBallon
//
//  Created by Clement Creusat on 11/06/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "RNString.h"
#import <React/RCTConvert.h>
#import <React/RCTLog.h>

@implementation RNString

// To export a module named CalendarManager
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getEmail:(NSString *)email)
{
  RCTLogInfo(@"Getting %@", email); 
  NSString *emailToSave = email;
  [[NSUserDefaults standardUserDefaults] setObject:emailToSave forKey:@"username"];
//  [[NSUserDefaults standardUserDefaults] setObject:emailToSave forKey:@"preferenceName"];
//  [[NSUserDefaults standardUserDefaults] synchronize];
  
  //NSLog(@"Greeting message: %@\n", emailToSave );
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;  // only do this if your module initialization relies on calling UIKit!
}

@end

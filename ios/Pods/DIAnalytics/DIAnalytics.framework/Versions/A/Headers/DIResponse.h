//
//  DIResponse.h
//  Pods
//
//  Created by Samuel Cote on 2016-10-31.
//
//

#import <Foundation/Foundation.h>

@interface DIResponse : NSObject

@property (nonatomic, strong) NSNumber* idRequest;
@property (nonatomic, strong) NSString* errorCode;
@property (nonatomic, strong) NSString* errorMessage;
@property (nonatomic) BOOL success;

@end

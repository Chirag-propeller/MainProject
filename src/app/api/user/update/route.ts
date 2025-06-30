import { getUserFromRequest } from "@/lib/auth";
import User from "@/model/user/user.model";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for profile updates
const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional().transform(val => val === "" ? undefined : val),
  language: z.string().optional(),
  timezone: z.string().optional(),
  emailUpdates: z.boolean().optional(),
  productNews: z.boolean().optional(),
  usageAlerts: z.boolean().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get authenticated user
    const userData = await getUserFromRequest(req);
    if (!userData?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate input data
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: result.error.flatten() 
        }, 
        { status: 400 }
      );
    }

    const updateData = result.data;

    // Get current user to check email changes
    const currentUser = await User.findById(userData.userId);
    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }

    // If email is being updated, check verification and uniqueness
    if (updateData.email && updateData.email.toLowerCase() !== currentUser.email.toLowerCase()) {
      console.log('Email change detected:', {
        newEmail: updateData.email,
        currentEmail: currentUser.email,
        hasOtp: !!currentUser.otp,
        hasOtpExpiry: !!currentUser.otpExpiry,
        otpExpired: currentUser.otpExpiry ? new Date(currentUser.otpExpiry).getTime() < Date.now() : null
      });

      // Check if email change verification is still pending
      // If user still has an active OTP (not expired), they haven't completed verification
      if (currentUser.otp && currentUser.otpExpiry && new Date(currentUser.otpExpiry).getTime() > Date.now()) {
        console.log('Email verification still pending');
        return NextResponse.json(
          { error: "Please verify your new email address before updating" }, 
          { status: 400 }
        );
      }

      // Check if the new email already exists in the system
      const existingUser = await User.findOne({ 
        email: updateData.email.toLowerCase(),
        _id: { $ne: userData.userId } // Exclude current user
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already exists" }, 
          { status: 400 }
        );
      }
      
      // Convert email to lowercase
      updateData.email = updateData.email.toLowerCase();
      console.log('Email change approved, proceeding with update');
    }

    // Prepare update operation
    const updateOperation: any = {};
    const unsetOperation: any = {};

    // Handle regular updates and empty phone field
    (Object.keys(updateData) as Array<keyof typeof updateData>).forEach(key => {
      if (key === 'phone' && (updateData[key] === undefined || updateData[key] === null)) {
        unsetOperation.phone = "";
      } else if (updateData[key] !== undefined) {
        updateOperation[key] = updateData[key];
      }
    });

    // Build the final update object
    const finalUpdate: any = {};
    if (Object.keys(updateOperation).length > 0) {
      finalUpdate.$set = updateOperation;
    }
    if (Object.keys(unsetOperation).length > 0) {
      finalUpdate.$unset = unsetOperation;
    }

    // Update user in database
    console.log('About to update user with:', finalUpdate);
    
    const updatedUser = await User.findByIdAndUpdate(
      userData.userId,
      finalUpdate,
      { 
        new: true, 
        runValidators: true,
        select: '-password -otp -forgotPasswordToken -verifyToken' // Exclude sensitive fields
      }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('User updated successfully. New email:', updatedUser.email);

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: updatedUser
    }, { status: 200 });

  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
} 
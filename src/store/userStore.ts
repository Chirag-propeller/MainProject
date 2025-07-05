import { create } from 'zustand'
import { Types } from 'mongoose';

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "suspended" | "paid";
export type AuthProvider = "email" | "google" | "github";

export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string;
    isVerified: boolean,
    profilePicture?: string;
    phone?: string;
    role: UserRole;
    status: UserStatus;
    authProvider: AuthProvider;
    oauthProviderId?: string;
    emailVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt?: Date;
    language?: string;
    timezone?: string;
    emailUpdates: boolean;
    productNews: boolean;
    usageAlerts: boolean;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    agents: Types.ObjectId[];
    phoneNumbers: Types.ObjectId[];
    knowledgeBases: Types.ObjectId[];
    campaigns: Types.ObjectId[];
    otp?: string;
    otpExpiry?: Date;
    credits: Types.Decimal128;
    creditsUsed: Types.Decimal128;
    callHistoryFields: string[];
    premium: boolean;
}

export const useUserStore = create<User>((set, get) => ({
    _id: '',
    name: '',
    email: '',
    password: '',
    isVerified: false,
    profilePicture: '',
    phone: '',
    role: 'user',
    status: 'active',
    authProvider: 'email',
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    language: 'en',
    timezone: 'IST',
    emailUpdates: true,
    productNews: true,
    usageAlerts: true,
    forgotPasswordToken: '',
    forgotPasswordTokenExpiry: new Date(),
    verifyToken: '',
    verifyTokenExpiry: new Date(),
    agents: [],
    phoneNumbers: [],
    knowledgeBases: [],
    campaigns: [],
    otp: '',
    otpExpiry: new Date(),
    credits: Types.Decimal128.fromString('0'),
    creditsUsed: Types.Decimal128.fromString('0'),
    callHistoryFields: [],
    premium: false,
    setName: (name: string) => set({ name }),
    setEmail: (email: string) => set({ email }),
    setPassword: (password: string) => set({ password }),
    setIsVerified: (isVerified: boolean) => set({ isVerified }),
    setProfilePicture: (profilePicture: string) => set({ profilePicture }),
    setPhone: (phone: string) => set({ phone }),
    setRole: (role: UserRole) => set({ role }),
    setStatus: (status: UserStatus) => set({ status }),
    setAuthProvider: (authProvider: AuthProvider) => set({ authProvider }),
    setEmailVerified: (emailVerified: boolean) => set({ emailVerified }),
    setCreatedAt: (createdAt: Date) => set({ createdAt }),
    setUpdatedAt: (updatedAt: Date) => set({ updatedAt }),
    setLanguage: (language: string) => set({ language }),
    setTimezone: (timezone: string) => set({ timezone }),
    setEmailUpdates: (emailUpdates: boolean) => set({ emailUpdates }),
    setProductNews: (productNews: boolean) => set({ productNews }),
    setUsageAlerts: (usageAlerts: boolean) => set({ usageAlerts }),
    setForgotPasswordToken: (forgotPasswordToken: string) => set({ forgotPasswordToken }),
    setForgotPasswordTokenExpiry: (forgotPasswordTokenExpiry: Date) => set({ forgotPasswordTokenExpiry }),
    setVerifyToken: (verifyToken: string) => set({ verifyToken }),
    setVerifyTokenExpiry: (verifyTokenExpiry: Date) => set({ verifyTokenExpiry }),
    setAgents: (agents: Types.ObjectId[]) => set({ agents }),
    setPhoneNumbers: (phoneNumbers: Types.ObjectId[]) => set({ phoneNumbers }),
    setKnowledgeBases: (knowledgeBases: Types.ObjectId[]) => set({ knowledgeBases }),
    setCampaigns: (campaigns: Types.ObjectId[]) => set({ campaigns }),
    setOtp: (otp: string) => set({ otp }),
    setOtpExpiry: (otpExpiry: Date) => set({ otpExpiry }),
    setCredits: (credits: Types.Decimal128) => set({ credits }),
    setCreditsUsed: (creditsUsed: Types.Decimal128) => set({ creditsUsed }),
    setCallHistoryFields: (callHistoryFields: string[]) => set({ callHistoryFields }),
    setPremium: (premium: boolean) => set({ premium }),
    setUser: (user: User) => set({ 
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
        phone: user.phone,
        role: user.role,
        status: user.status,
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        language: user.language,
        timezone: user.timezone,
        emailUpdates: user.emailUpdates,
        productNews: user.productNews,
        usageAlerts: user.usageAlerts,
        forgotPasswordToken: user.forgotPasswordToken,
        forgotPasswordTokenExpiry: user.forgotPasswordTokenExpiry,
        verifyToken: user.verifyToken,
        verifyTokenExpiry: user.verifyTokenExpiry,
        agents: user.agents,
        phoneNumbers: user.phoneNumbers,
        knowledgeBases: user.knowledgeBases,
        campaigns: user.campaigns,
        otp: user.otp,
        otpExpiry: user.otpExpiry,
        credits: user.credits,
        creditsUsed: user.creditsUsed,
        callHistoryFields: user.callHistoryFields,
        premium: user.premium,
    }),
    getUser: () => get(),
    getUserId: () => get()._id,
    getUserRole: () => get().role,
    getUserStatus: () => get().status,
    getUserAuthProvider: () => get().authProvider,
    getUserEmailVerified: () => get().emailVerified,
    getUserCreatedAt: () => get().createdAt,
    getUserUpdatedAt: () => get().updatedAt,
    getUserLanguage: () => get().language,
    getUserTimezone: () => get().timezone,
    getUserEmailUpdates: () => get().emailUpdates,
    getUserProductNews: () => get().productNews,
    getUserUsageAlerts: () => get().usageAlerts,
    getUserForgotPasswordToken: () => get().forgotPasswordToken,
    getUserForgotPasswordTokenExpiry: () => get().forgotPasswordTokenExpiry,
    getUserVerifyToken: () => get().verifyToken,
    getUserVerifyTokenExpiry: () => get().verifyTokenExpiry,
    getUserAgents: () => get().agents,
    getUserPhoneNumbers: () => get().phoneNumbers,
    getUserKnowledgeBases: () => get().knowledgeBases,
    getUserCampaigns: () => get().campaigns,
    getUserOtp: () => get().otp,
    getUserOtpExpiry: () => get().otpExpiry,
    getUserCredits: () => get().credits,
    getUserCreditsUsed: () => get().creditsUsed,
    getUserCallHistoryFields: () => get().callHistoryFields,
    getUserPremium: () => get().premium,
}))
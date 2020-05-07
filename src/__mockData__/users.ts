export default {
  login: {
    success: true,
    data: {
      user: {
        userId: 5,
        email: 'test@test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        lastSession: new Date(),
        firstName: null,
        lastName: null,
        phone: null,
        birthday: null,
        emailVerified: false,
        phoneVerified: false,
        gender: null,
        notificationEmail: false,
        notificationSms: false,
        subscription: false,
        referrer: null,
        resetPasswordToken: null,
        roles: []
      }
    },
    anonymous: false
  },
  roles: {
    success: true,
    data: {}
  }
}
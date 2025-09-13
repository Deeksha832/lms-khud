// import { clerkClient } from "@clerk/express"

// // Middleware ( Protect Educator Routes )
// export const protectEducator = async (req,res,next) => {

//     try {

//         const userId = req.auth.userId
        
//         const response = await clerkClient.users.getUser(userId)

//         if (response.publicMetadata.role !== 'educator') {
//             return res.json({success:false, message: 'Unauthorized Access'})
//         }
        
//         next ()

//     } catch (error) {
//         res.json({success:false, message: error.message})
//     }

// }
import { requireAuth } from "@clerk/express";import { clerkClient } from "@clerk/express"

// Middleware ( Protect Educator Routes )
export const protectEducator = async (req, res, next) => {
  try {
    // Clerk puts the auth object here
    const { userId } = req.auth

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - No userId found" })
    }

    // Get the user from Clerk
    const response = await clerkClient.users.getUser(userId)

    if (response.publicMetadata.role !== "educator") {
      return res.status(403).json({ success: false, message: "Unauthorized Access" })
    }

    next()
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

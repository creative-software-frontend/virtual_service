const membershipService = require("../services/membershipService");

async function buyMembership(req, res) {
  try {
    const userId = req.user?.id;

    console.log("Membership purchase request:", req.body);

    const { package_id } = req.body || {};

    const packageIdNum = Number(package_id);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!Number.isFinite(packageIdNum) || packageIdNum <= 0) {
      return res.status(400).json({ message: "Invalid package_id" });
    }


    const result = await membershipService.buyMembership({ userId, packageId: packageIdNum });
    return res.status(200).json({
      success: true,
      message: "Membership activated successfully",
      package_id: result?.package_id,
    });

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || "Membership purchase failed" });
  }
}

async function getMembershipStatus(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await membershipService.getMembershipStatus(userId);
    return res.json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || "Failed to fetch membership status" });
  }
}

async function getCurrentMembership(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await membershipService.getCurrentMembership(userId);
    return res.json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || "Failed to fetch current membership" });
  }
}

async function getUserPackages(req, res) {
  try {
    const result = await membershipService.getUserPackages();
    return res.json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || "Failed to fetch user packages" });
  }
}

async function getProviderPackages(req, res) {
  try {
    const result = await membershipService.getProviderPackages();
    return res.json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || "Failed to fetch provider packages" });
  }
}

module.exports = {
  buyMembership,
  getMembershipStatus,
  getCurrentMembership,
  getUserPackages,
  getProviderPackages,
};



/**
 * WhatsApp Simulator
 * ============================================================
 * Simulates WhatsApp delivery by logging messages and storing
 * an activity event for audit/traceability.
 */

import prisma from "./prisma.js";

/**
 * Simulate sending a WhatsApp message.
 *
 * @param {object} params
 * @param {string} params.triggeredBy - User ID initiating the message event.
 * @param {string} params.targetUserId - User ID receiving the message.
 * @param {string} params.message - Message content.
 */
export async function sendWhatsAppMessage({ triggeredBy, targetUserId, message }) {
    const line = `[WhatsApp Simulator] to=${targetUserId}: ${message}`;
    console.log(line);

    await prisma.activityLog.create({
        data: {
            userId: triggeredBy,
            action: "SEND_WHATSAPP_SIMULATED",
            entity: "User",
            entityId: targetUserId,
            details: JSON.stringify({ message }),
        },
    });
}

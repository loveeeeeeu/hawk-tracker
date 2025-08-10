// import { getSessionId } from "../utils/session.js";
import { getCookie, setCookie, generateUUID } from "../utils/common.js";
import { SDK_VERSION, SDK_USER_UUID } from "./constant.js";
import { InternalConfig } from "../types/options.js";
import { getSessionId } from "../utils/session.js";
import { _global } from "../utils/global.js";
export async function initBaseInfo(configs: InternalConfig): Promise<any> {
    const baseInfo: any = {
        ...getAppInfo(configs),
        ...await getDeviceInfo(),
        ...getSdkInfo(),
        ...getUserInfo()
    }
    return baseInfo
}

// 应用信息
function getAppInfo(configs: InternalConfig) {
    return {
        appName: configs.appName,
        appCode: configs.appCode,
        appVersion: configs.appVersion,
        // pageId: generateUUID(),
        // sessionId: getSessionId(),
        // startTime: Date.now(),
        // url: window.location.href,
        // title: document.title,
        // referrer: document.referrer
    }
}
// 用户信息
function getUserInfo() {
    return {
        userUuid: getCookie(SDK_USER_UUID) || generateUUID(),
        sessionId: getSessionId(),
        extendData: {}
    }
}
// 设备信息
async function getDeviceInfo() {
    const { screen, navigator } = _global
    const { documentElement } = _global.document

    return {
        // 屏幕信息
        
        screenWidth: screen.width,
        screenHeight: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
       

        // 视窗信息
        
        clientWidth: documentElement.clientWidth,
        clientHeight: documentElement.clientHeight,
        

        // 浏览器信息
        vendor: navigator.vendor,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        

        // 设备标识
        deviceId: await getOrCreateDeviceId(),
        // fingerprint: await generateFingerprint()
    }
}

async function getOrCreateDeviceId() {
    const stored = getCookie('hawk_device_id')
    if (stored) return stored

    const deviceId = `device_${await generateFingerprint()}`
    setCookie('hawk_device_id', deviceId, 365) // 1年过期
    return deviceId
}

async function generateFingerprint() {
    // 使用 fingerprintjs 生成设备指纹
    const fp = await import('@fingerprintjs/fingerprintjs') // 这里需要引入fingerprintjs    
    const result = await fp.load({}).then(fp => fp.get())
    return result.visitorId
}

// SDK信息
function getSdkInfo() {
    return {
        sdkVersion: SDK_VERSION,
        sdkUserUuid: generateUUID()
    }
}
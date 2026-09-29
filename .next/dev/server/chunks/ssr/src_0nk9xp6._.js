module.exports = [
"[project]/src/app/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$theme$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/theme/index.ts [app-rsc] (ecmascript)");
;
;
;
;
const metadata = {
    title: "LifeCome Live - Operations console",
    description: "Admin, payer ops, support and audit tooling for LifeCome Live staff.",
    robots: {
        index: false,
        follow: false
    }
};
async function RootLayout({ children }) {
    const stored = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$theme$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["THEME_COOKIE"])?.value;
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$theme$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isThemePreference"])(stored) ? stored : "system";
    return(// The avatar menu changes `data-theme` on the client without a re-render of this element.
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        "data-theme": theme,
        suppressHydrationWarning: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/layout.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this));
}
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/theme/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** The operator's theme choice. `system` follows the OS and updates live when the OS switches. */ __turbopack_context__.s([
    "THEME_COOKIE",
    ()=>THEME_COOKIE,
    "applyThemePreference",
    ()=>applyThemePreference,
    "isThemePreference",
    ()=>isThemePreference
]);
const THEME_COOKIE = "lc_theme";
function isThemePreference(value) {
    return value === "system" || value === "light" || value === "dark";
}
function applyThemePreference(preference) {
    document.documentElement.dataset.theme = preference;
    document.cookie = `${THEME_COOKIE}=${preference}; path=/; max-age=31536000; samesite=lax`;
}
}),
];

//# sourceMappingURL=src_0nk9xp6._.js.map
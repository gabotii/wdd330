(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(e){if(e.ep)return;e.ep=!0;const r=n(e);fetch(e.href,r)}})();function l(o){return JSON.parse(localStorage.getItem(o))}function u(o,t){localStorage.setItem(o,JSON.stringify(t))}function f(o){const t=window.location.search;return new URLSearchParams(t).get(o)}function d(o,t,n,i="afterbegin",e=!0){e&&(t.innerHTML="");const r=n.map(o);t.insertAdjacentHTML(i,r.join(""))}async function a(o,t,n,i,e="afterbegin",r=!0){r&&(t.innerHTML="");const s=await o(n);t.insertAdjacentHTML(e,s),i&&i(n)}function c(o){return async function(){const t=await fetch(o);if(t.ok)return await t.text()}}async function m(){const o=c("/partials/header.html"),t=c("/partials/footer.html"),n=document.querySelector("#main-header"),i=document.querySelector("#main-footer");a(o,n),a(t,i)}export{f as a,l as g,m as l,d as r,u as s};

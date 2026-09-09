// Import Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ==========================================
// YOUR FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyC5roVwqoef-f5GlfxeJ4Ir5-olRh05Z0Y",
    authDomain: "football-talent-app.firebaseapp.com",
    projectId: "football-talent-app",
    storageBucket: "football-talent-app.firebasestorage.app",
    messagingSenderId: "1042968175565",
    appId: "1:1042968175565:web:978ce473dde234b7199a84",
    measurementId: "G-KK4KPXLL30"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to convert Google Drive sharing links into direct image view links
function formatImageUrl(url) {
    if (!url) return "";
    // Check if it's a Google Drive link containing file ID
    if (url.includes("drive.google.com")) {
        const match = url.match(/\/d\/(.*?)\/|\?id=(.*?)(&|$)/);
        const fileId = match ? (match[1] || match[2]) : null;
        if (fileId) {
            return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
    }
    return url;
}

// ==========================================
// 1. REGISTRATION LOGIC (register.html)
// ==========================================
const registrationForm = document.getElementById("registration-form");

if (registrationForm) {
    registrationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const position = document.getElementById("position").value;
        const age = Number(document.getElementById("age").value);
        const preferredFoot = document.getElementById("preferredFoot").value;
        const height = document.getElementById("height").value;
        const nationality = document.getElementById("nationality").value;
        const rawPhotoUrl = document.getElementById("photoUrl").value;
        const highlightVideoUrl = document.getElementById("highlightVideoUrl").value;
        const bio = document.getElementById("bio").value;

        // Convert Google Drive link format if applicable
        const photoUrl = formatImageUrl(rawPhotoUrl);

        try {
            await addDoc(collection(db, "players"), {
                fullName: fullName,
                email: email,
                phone: phone,
                position: position,
                age: age,
                preferredFoot: preferredFoot,
                height: height,
                nationality: nationality,
                photoUrl: photoUrl || "",
                highlightVideoUrl: highlightVideoUrl || "",
                bio: bio || "Grassroots prospect ready for trials and scouting evaluation.",
                status: "Pending Verification",
                createdAt: new Date()
            });

            alert("Registration CV submitted successfully! Pending verification by administration.");
            registrationForm.reset();
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error submitting registration. Please check your connection.");
        }
    });
}

// ==========================================
// 2. LANDING PAGE DIRECTORY LOGIC (index.html)
// ==========================================
const playerGrid = document.getElementById("player-grid");

async function loadVerifiedPlayers() {
    if (!playerGrid) return;

    try {
        const querySnapshot = await getDocs(collection(db, "players"));
        
        let verifiedCount = 0;
        playerGrid.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            const player = docSnap.data();

            if (player.status === "Verified") {
                verifiedCount++;
                
                // Determine photo display (Image or professional unknown player silhouette icon)
                let photoHtml = '';
                if (player.photoUrl && player.photoUrl.trim() !== "") {
                    photoHtml = `
                        <div class="h-56 w-full overflow-hidden rounded-lg mb-4 bg-slate-950 border border-slate-800">
                            <img src="${player.photoUrl}" alt="${player.fullName}" class="w-full h-full object-cover hover:scale-105 transition duration-300" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'h-full w-full flex items-center justify-center bg-slate-950 text-slate-600\'><svg class=\'w-20 h-20\' fill=\'currentColor\' viewBox=\'0 0 24 24\'><path d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/></svg></div>';">
                        </div>
                    `;
                } else {
                    photoHtml = `
                        <div class="h-56 w-full flex items-center justify-center rounded-lg mb-4 bg-slate-950 border border-slate-800 text-slate-600">
                            <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    `;
                }

                // Determine video action
                let videoActionHtml = '';
                if (player.highlightVideoUrl && player.highlightVideoUrl.trim() !== "") {
                    videoActionHtml = `
                        <a href="${player.highlightVideoUrl}" target="_blank" 
                           class="block text-center w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-lg transition text-sm border border-slate-700 mb-2">
                            View Highlight Video
                        </a>
                    `;
                }

                const playerCard = document.createElement("div");
                playerCard.className = "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col justify-between";
                playerCard.innerHTML = `
                    <div>
                        ${photoHtml}
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h3 class="text-xl font-bold text-slate-100">${player.fullName}</h3>
                                <p class="text-emerald-400 text-sm font-semibold">${player.position} &bull; <span class="text-slate-300 font-normal">${player.preferredFoot} Foot</span></p>
                            </div>
                            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium">Verified</span>
                        </div>
                        
                        <div class="space-y-1.5 text-sm text-slate-300 mb-4">
                            <p><span class="text-slate-500">Age:</span> ${player.age} yrs</p>
                            <p><span class="text-slate-500">Height:</span> ${player.height}</p>
                            <p><span class="text-slate-500">Nationality:</span> ${player.nationality}</p>
                            <p class="text-xs text-slate-400 mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800 italic">"${player.bio}"</p>
                        </div>
                    </div>

                    <div>
                        ${videoActionHtml}
                        <a href="https://wa.me/${player.phone.replace(/[^0-9]/g, '')}" target="_blank" 
                           class="block text-center w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-semibold py-2 rounded-lg transition text-sm">
                            Contact via WhatsApp
                        </a>
                    </div>
                `;
                playerGrid.appendChild(playerCard);
            }
        });

        if (verifiedCount === 0) {
            playerGrid.innerHTML = `
                <div class="col-span-full text-center py-12 text-slate-400">
                    <p class="text-lg">No verified player profiles available right now.</p>
                    <p class="text-sm mt-1">Check back soon or register a new player profile.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error loading players: ", error);
    }
}

loadVerifiedPlayers();

// ==========================================
// 3. ADMIN DASHBOARD LOGIC (admin.html)
// ==========================================
const loginForm = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const logoutBtn = document.getElementById("logout-btn");
const adminPlayerList = document.getElementById("admin-player-list");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const pass = document.getElementById("admin-pass").value;

        if (pass === "admin123") {
            loginSection.classList.add("hidden");
            dashboardSection.classList.remove("hidden");
            loadPendingPlayers();
        } else {
            alert("Incorrect passcode. Access denied.");
        }
    });

    logoutBtn.addEventListener("click", () => {
        dashboardSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
        document.getElementById("admin-pass").value = "";
    });
}

async function loadPendingPlayers() {
    if (!adminPlayerList) return;

    try {
        const querySnapshot = await getDocs(collection(db, "players"));
        adminPlayerList.innerHTML = "";
        let pendingCount = 0;

        querySnapshot.forEach((docSnap) => {
            const player = docSnap.data();
            const playerId = docSnap.id;

            if (player.status === "Pending Verification") {
                pendingCount++;
                
                // Admin thumbnail with fallback icon
                let thumbHtml = player.photoUrl ? `<img src="${player.photoUrl}" class="w-12 h-12 object-cover rounded-lg border border-slate-700">` : `<div class="w-12 h-12 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>`;

                const row = document.createElement("div");
                row.className = "bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4";
                row.innerHTML = `
                    <div class="flex items-center gap-3">
                        ${thumbHtml}
                        <div>
                            <h3 class="font-bold text-lg text-slate-100">${player.fullName} <span class="text-emerald-400 text-sm">(${player.position} - ${player.preferredFoot} Foot)</span></h3>
                            <p class="text-xs text-slate-400">Phone: ${player.phone} | Age: ${player.age} | Nat: ${player.nationality}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 w-full md:w-auto">
                        <button data-id="${playerId}" class="approve-btn flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition">
                            Approve
                        </button>
                        <button data-id="${playerId}" class="delete-btn flex-1 md:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold px-4 py-2 rounded-lg text-sm transition">
                            Delete
                        </button>
                    </div>
                `;
                adminPlayerList.appendChild(row);
            }
        });

        if (pendingCount === 0) {
            adminPlayerList.innerHTML = `<p class="text-slate-400 text-sm py-4 text-center">No pending registrations waiting for review.</p>`;
        } else {
            document.querySelectorAll(".approve-btn").forEach((button) => {
                button.addEventListener("click", async (e) => {
                    const idToVerify = e.target.getAttribute("data-id");
                    await approvePlayer(idToVerify);
                });
            });

            document.querySelectorAll(".delete-btn").forEach((button) => {
                button.addEventListener("click", async (e) => {
                    const idToDelete = e.target.getAttribute("data-id");
                    await deletePlayer(idToDelete);
                });
            });
        }
    } catch (error) {
        console.error("Error loading pending players: ", error);
        adminPlayerList.innerHTML = `<p class="text-red-400 text-sm">Error loading data from database.</p>`;
    }
}

async function approvePlayer(id) {
    try {
        const playerDocRef = doc(db, "players", id);
        await updateDoc(playerDocRef, {
            status: "Verified"
        });

        alert("Player approved and verified successfully!");
        loadPendingPlayers();
    } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to verify player.");
    }
}

async function deletePlayer(id) {
    if (confirm("Are you sure you want to delete this player submission?")) {
        try {
            await deleteDoc(doc(db, "players", id));
            alert("Player submission deleted successfully.");
            loadPendingPlayers();
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("Failed to delete player profile.");
        }
    }
}
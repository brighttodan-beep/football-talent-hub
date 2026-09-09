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
        const highlightVideoUrl = document.getElementById("highlightVideoUrl").value;
        const bio = document.getElementById("bio").value;

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
                
                // Determine button/link action based on whether video exists
                let actionHtml = '';
                if (player.highlightVideoUrl && player.highlightVideoUrl.trim() !== "") {
                    actionHtml = `
                        <a href="${player.highlightVideoUrl}" target="_blank" 
                           class="block text-center w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-lg transition text-sm border border-slate-700 mb-2">
                            View Highlight Video
                        </a>
                    `;
                } else {
                    actionHtml = `
                        <div class="bg-slate-950 border border-slate-800 rounded-lg p-2 text-center text-xs text-amber-400 mb-2">
                            Fresh Prospect (Video Reel Pending)
                        </div>
                    `;
                }

                const playerCard = document.createElement("div");
                playerCard.className = "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col justify-between";
                playerCard.innerHTML = `
                    <div>
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-slate-100">${player.fullName}</h3>
                                <p class="text-emerald-400 text-sm font-semibold">${player.position} &bull; <span class="text-slate-300 font-normal">Preferred Foot: ${player.preferredFoot || 'N/A'}</span></p>
                            </div>
                            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium">Verified CV</span>
                        </div>
                        
                        <div class="space-y-1.5 text-sm text-slate-300 mb-4">
                            <p><span class="text-slate-500">Age:</span> ${player.age} yrs</p>
                            <p><span class="text-slate-500">Height:</span> ${player.height}</p>
                            <p><span class="text-slate-500">Nationality:</span> ${player.nationality}</p>
                            <p class="text-xs text-slate-400 mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800 italic">"${player.bio}"</p>
                        </div>
                    </div>

                    <div>
                        ${actionHtml}
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
                const row = document.createElement("div");
                row.className = "bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4";
                row.innerHTML = `
                    <div>
                        <h3 class="font-bold text-lg text-slate-100">${player.fullName} <span class="text-emerald-400 text-sm">(${player.position} - ${player.preferredFoot || 'N/A'} Foot)</span></h3>
                        <p class="text-xs text-slate-400">Phone: ${player.phone} | Email: ${player.email} | Age: ${player.age} | Height: ${player.height} | Nat: ${player.nationality}</p>
                        <p class="text-xs text-slate-300 mt-1"><strong>Bio:</strong> ${player.bio}</p>
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
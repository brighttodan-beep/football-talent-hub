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
        const photoFileInput = document.getElementById("photoFile");
        const highlightVideoUrl = document.getElementById("highlightVideoUrl").value;
        const bio = document.getElementById("bio").value;

        let photoUrl = "";

        if (photoFileInput && photoFileInput.files && photoFileInput.files[0]) {
            const file = photoFileInput.files[0];
            try {
                photoUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => resolve(event.target.result);
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });
            } catch (err) {
                console.error("Error reading file: ", err);
            }
        }

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

            await emailjs.send("service_vv2mseb", "template_kr3uq76", {
                to_email: "brighttodan@gmail.com",
                player_name: fullName,
                player_position: position,
                player_phone: phone,
                player_age: age,
                player_nationality: nationality
            }, "HcmsfZtrpUpNxwrH7");

            alert("Registration CV submitted successfully! Pending verification by administration.");
            registrationForm.reset();
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error submitting registration or sending email: ", error);
            alert("Registration saved, but notification email failed to send. Check console for details.");
            window.location.href = "index.html";
        }
    });
}

// ==========================================
// 2. LANDING PAGE DIRECTORY & MODAL LOGIC (index.html)
// ==========================================
const playerGrid = document.getElementById("player-grid");
const filterPosition = document.getElementById("filter-position");
const filterFoot = document.getElementById("filter-foot");
const sortSelect = document.getElementById("sort-select");

const playerModal = document.getElementById("player-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalContent = document.getElementById("modal-content");

let allVerifiedPlayers = [];

async function loadVerifiedPlayers() {
    if (!playerGrid) return;

    try {
        const querySnapshot = await getDocs(collection(db, "players"));
        allVerifiedPlayers = [];

        querySnapshot.forEach((docSnap) => {
            const player = docSnap.data();
            if (player.status === "Verified") {
                allVerifiedPlayers.push({ id: docSnap.id, ...player });
            }
        });

        applyFiltersAndSorting();
    } catch (error) {
        console.error("Error loading players: ", error);
    }
}

function renderPlayerCards(playersToDisplay) {
    if (!playerGrid) return;

    playerGrid.innerHTML = "";

    if (playersToDisplay.length === 0) {
        playerGrid.innerHTML = `
            <div class="col-span-full text-center py-12 text-slate-400">
                <p class="text-lg">No verified player profiles match your criteria.</p>
                <p class="text-sm mt-1">Try selecting different options or clear your filters.</p>
            </div>
        `;
        return;
    }

    playersToDisplay.forEach((player) => {
        let photoHtml = '';
        if (player.photoUrl && player.photoUrl.trim() !== "") {
            photoHtml = `
                <div class="h-56 w-full overflow-hidden rounded-lg mb-4 bg-slate-950 border border-slate-800">
                    <img src="${player.photoUrl}" alt="${player.fullName}" class="w-full h-full object-cover hover:scale-105 transition duration-300">
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

        const playerCard = document.createElement("div");
        playerCard.className = "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col justify-between hover:border-emerald-500/50 transition cursor-pointer";
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
                
                <div class="space-y-1.5 text-sm text-slate-300 mb-6">
                    <p><span class="text-slate-500">Age:</span> ${player.age} yrs</p>
                    <p><span class="text-slate-500">Height:</span> ${player.height}</p>
                    <p><span class="text-slate-500">Nationality:</span> ${player.nationality}</p>
                </div>
            </div>

            <button class="view-dossier-btn w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-lg transition text-sm border border-slate-700 text-center">
                View Full Dossier & Video
            </button>
        `;

        // Click anywhere on card or button opens the modal
        playerCard.addEventListener("click", () => {
            openPlayerModal(player);
        });

        playerGrid.appendChild(playerCard);
    });
}

// Open Detailed Modal
function openPlayerModal(player) {
    if (!playerModal || !modalContent) return;

    let modalPhotoHtml = '';
    if (player.photoUrl && player.photoUrl.trim() !== "") {
        modalPhotoHtml = `<img src="${player.photoUrl}" alt="${player.fullName}" class="w-full h-72 object-cover rounded-xl border border-slate-800 mb-6">`;
    } else {
        modalPhotoHtml = `
            <div class="w-full h-48 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-slate-600 mb-6">
                <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </div>
        `;
    }

    let videoSectionHtml = '';
    if (player.highlightVideoUrl && player.highlightVideoUrl.trim() !== "") {
        videoSectionHtml = `
            <div class="mt-6 bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <h4 class="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Scouting Highlight Video</h4>
                <a href="${player.highlightVideoUrl}" target="_blank" class="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:underline text-sm">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Watch Match Highlights / Video Reel &rarr;
                </a>
            </div>
        `;
    }

    modalContent.innerHTML = `
        ${modalPhotoHtml}
        <div class="flex justify-between items-start mb-4">
            <div>
                <h2 class="text-2xl font-black text-slate-100">${player.fullName}</h2>
                <p class="text-emerald-400 font-semibold text-base">${player.position}</p>
            </div>
            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-semibold">Verified Profile</span>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 text-sm">
            <div>
                <span class="block text-xs text-slate-500 uppercase">Age</span>
                <span class="font-bold text-slate-200">${player.age} Years</span>
            </div>
            <div>
                <span class="block text-xs text-slate-500 uppercase">Height</span>
                <span class="font-bold text-slate-200">${player.height}</span>
            </div>
            <div>
                <span class="block text-xs text-slate-500 uppercase">Preferred Foot</span>
                <span class="font-bold text-slate-200">${player.preferredFoot}</span>
            </div>
            <div>
                <span class="block text-xs text-slate-500 uppercase">Nationality</span>
                <span class="font-bold text-slate-200">${player.nationality}</span>
            </div>
        </div>

        <div class="mb-6">
            <h4 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Player Background & Scouting Profile</h4>
            <p class="text-slate-300 text-sm leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">"${player.bio}"</p>
        </div>

        ${videoSectionHtml}

        <div class="mt-8 pt-4 border-t border-slate-800 flex flex-col md:flex-row gap-3">
            <a href="https://wa.me/${player.phone ? player.phone.replace(/[^0-9]/g, '') : ''}" target="_blank" 
               class="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-emerald-500/20">
                Contact via WhatsApp
            </a>
        </div>
    `;

    playerModal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

// Close Modal
function closePlayerModal() {
    if (!playerModal) return;
    playerModal.classList.add("hidden");
    document.body.style.overflow = "auto";
}

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closePlayerModal);
}

// Close modal when clicking outside the modal box
if (playerModal) {
    playerModal.addEventListener("click", (e) => {
        if (e.target === playerModal) {
            closePlayerModal();
        }
    });
}

// Helper to convert strings like "184 cm" or "1.84m" into numbers for accurate height sorting
function parseHeightInCm(heightStr) {
    if (!heightStr) return 0;
    const match = heightStr.match(/(\d+(\.\d+)?)/);
    if (!match) return 0;
    let val = parseFloat(match[0]);
    if (val < 3) val = val * 100;
    return val;
}

function applyFiltersAndSorting() {
    const selectedPosition = filterPosition ? filterPosition.value.trim() : "";
    const selectedFoot = filterFoot ? filterFoot.value.trim() : "";
    const sortValue = sortSelect ? sortSelect.value : "recent";

    let filtered = allVerifiedPlayers.filter(player => {
        const matchesPosition = selectedPosition === "" || (player.position && player.position.includes(selectedPosition));
        const matchesFoot = selectedFoot === "" || (player.preferredFoot && player.preferredFoot.toLowerCase() === selectedFoot.toLowerCase());
        return matchesPosition && matchesFoot;
    });

    filtered.sort((a, b) => {
        if (sortValue === "age-asc") {
            return (a.age || 0) - (b.age || 0);
        } else if (sortValue === "age-desc") {
            return (b.age || 0) - (a.age || 0);
        } else if (sortValue === "height-desc") {
            return parseHeightInCm(b.height) - parseHeightInCm(a.height);
        } else {
            const timeA = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
            const timeB = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
            return timeB - timeA;
        }
    });

    renderPlayerCards(filtered);
}

if (filterPosition) {
    filterPosition.addEventListener("change", applyFiltersAndSorting);
}
if (filterFoot) {
    filterFoot.addEventListener("change", applyFiltersAndSorting);
}
if (sortSelect) {
    sortSelect.addEventListener("change", applyFiltersAndSorting);
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
const adminVerifiedList = document.getElementById("admin-verified-list");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const pass = document.getElementById("admin-pass").value;

        if (pass === "admin123") {
            loginSection.classList.add("hidden");
            dashboardSection.classList.remove("hidden");
            loadAdminDashboardData();
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

async function loadAdminDashboardData() {
    if (!adminPlayerList || !adminVerifiedList) return;

    try {
        const querySnapshot = await getDocs(collection(db, "players"));
        adminPlayerList.innerHTML = "";
        adminVerifiedList.innerHTML = "";
        let pendingCount = 0;
        let verifiedCount = 0;

        querySnapshot.forEach((docSnap) => {
            const player = docSnap.data();
            const playerId = docSnap.id;

            let thumbHtml = player.photoUrl ? `<img src="${player.photoUrl}" class="w-12 h-12 object-cover rounded-lg border border-slate-700">` : `<div class="w-12 h-12 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>`;

            if (player.status === "Pending Verification") {
                pendingCount++;
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
            } else if (player.status === "Verified") {
                verifiedCount++;
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
                    <button data-id="${playerId}" class="delete-verified-btn bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold px-4 py-2 rounded-lg text-sm transition w-full md:w-auto">
                        Remove / Delete Profile
                    </button>
                `;
                adminVerifiedList.appendChild(row);
            }
        });

        if (pendingCount === 0) {
            adminPlayerList.innerHTML = `<p class="text-slate-400 text-sm py-4 text-center">No pending registrations waiting for review.</p>`;
        }
        if (verifiedCount === 0) {
            adminVerifiedList.innerHTML = `<p class="text-slate-400 text-sm py-4 text-center">No active verified players on the directory.</p>`;
        }

        document.querySelectorAll(".approve-btn").forEach((button) => {
            button.addEventListener("click", async (e) => {
                await approvePlayer(e.target.getAttribute("data-id"));
            });
        });

        document.querySelectorAll(".delete-btn, .delete-verified-btn").forEach((button) => {
            button.addEventListener("click", async (e) => {
                await deletePlayer(e.target.getAttribute("data-id"));
            });
        });

    } catch (error) {
        console.error("Error loading admin data: ", error);
    }
}

async function approvePlayer(id) {
    try {
        const playerDocRef = doc(db, "players", id);
        await updateDoc(playerDocRef, {
            status: "Verified"
        });

        alert("Player approved and verified successfully!");
        loadAdminDashboardData();
    } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to verify player.");
    }
}

async function deletePlayer(id) {
    if (confirm("Are you sure you want to delete this player profile completely?")) {
        try {
            await deleteDoc(doc(db, "players", id));
            alert("Player profile deleted successfully.");
            loadAdminDashboardData();
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("Failed to delete player profile.");
        }
    }
}
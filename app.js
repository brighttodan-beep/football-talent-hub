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
// INTERNATIONALIZATION (i18n) DICTIONARY
// ==========================================
const translations = {
    en: {
        navHome: "Home",
        navRegister: "Register Player",
        langLabel: "Français",
        pageTitle: "Player Registration | Football Talent Hub",
        formHeading: "Player Registration Dossier",
        formSubheading: "Submit your football profile for evaluation by FIFA-licensed agents and international scouts.",
        successTitle: "Registration Saved Successfully!",
        successDesc: "Your player profile has been logged into our database pending administrative verification. To fast-track your review, please notify our agency team via WhatsApp below.",
        whatsappBtn: "Send Manual Notification via WhatsApp",
        returnHome: "Return to Directory",
        lblFullname: "Full Legal Name *",
        lblEmail: "Email Address *",
        lblPhone: "WhatsApp / Phone Number *",
        lblNationality: "Nationality *",
        lblPosition: "Primary Position *",
        optSelectPos: "Select Position",
        lblAge: "Age *",
        lblFoot: "Preferred Foot *",
        optSelectFoot: "Select Foot",
        optLeft: "Left Foot",
        optRight: "Right Foot",
        optBoth: "Both Feet",
        lblHeight: "Height *",
        lblVideo: "Highlight Video Link (YouTube/Drive)",
        lblPhoto: "Player Passport / Action Photo *",
        lblBio: "Player Bio / Football Background History *",
        submitBtn: "Submit Player Registration",
        footerCopy: "© 2026 Football Talent Hub. All rights reserved.",
        footerSupport: "Support:"
    },
    fr: {
        navHome: "Accueil",
        navRegister: "Enregistrer un Joueur",
        langLabel: "English",
        pageTitle: "Enregistrement de Joueur | Hub de Talents",
        formHeading: "Dossier d'Enregistrement de Joueur",
        formSubheading: "Soumettez votre profil footballistique pour évaluation par des agents agréés FIFA et des recruteurs internationaux.",
        successTitle: "Enregistrement sauvegardé avec succès !",
        successDesc: "Votre profil de joueur a été enregistré dans notre base de données en attendant la vérification administrative. Pour accélérer votre examen, veuillez notifier notre équipe via WhatsApp ci-dessous.",
        whatsappBtn: "Envoyer une notification manuelle via WhatsApp",
        returnHome: "Retour au Répertoire",
        lblFullname: "Nom Légal Complet *",
        lblEmail: "Adresse Email *",
        lblPhone: "Numéro WhatsApp / Téléphone *",
        lblNationality: "Nationalité *",
        lblPosition: "Poste Principal *",
        optSelectPos: "Sélectionner le Poste",
        lblAge: "Âge *",
        lblFoot: "Pied Préféré *",
        optSelectFoot: "Sélectionner le Pied",
        optLeft: "Pied Gauche",
        optRight: "Pied Droit",
        optBoth: "Les Deux Pieds",
        lblHeight: "Taille *",
        lblVideo: "Lien Vidéo Faits Saillants (YouTube/Drive)",
        lblPhoto: "Photo de Passeport / Action du Joueur *",
        lblBio: "Biographie / Historique du Parcours de Football *",
        submitBtn: "Soumettre l'Enregistrement du Joueur",
        footerCopy: "© 2026 Football Talent Hub. Tous droits réservés.",
        footerSupport: "Support :"
    }
};

let currentLang = localStorage.getItem("tcs_lang") || "en";

function updatePageLanguage() {
    const t = translations[currentLang];
    
    // Update Header / Nav
    if (document.getElementById("page-title")) document.getElementById("page-title").innerText = t.pageTitle;
    if (document.querySelector("[data-i18n='navHome']")) document.querySelector("[data-i18n='navHome']").innerText = t.navHome;
    if (document.querySelector("[data-i18n='navRegister']")) document.querySelector("[data-i18n='navRegister']").innerText = t.navRegister;
    if (document.getElementById("lang-label")) document.getElementById("lang-label").innerText = t.langLabel;

    // Update Form Headings & Success card
    if (document.getElementById("form-heading")) document.getElementById("form-heading").innerText = t.formHeading;
    if (document.getElementById("form-subheading")) document.getElementById("form-subheading").innerText = t.formSubheading;
    if (document.getElementById("success-title")) document.getElementById("success-title").innerText = t.successTitle;
    if (document.getElementById("success-desc")) document.getElementById("success-desc").innerText = t.successDesc;
    if (document.getElementById("whatsapp-btn-text")) document.getElementById("whatsapp-btn-text").innerText = t.whatsappBtn;
    if (document.getElementById("return-home-btn")) document.getElementById("return-home-btn").innerText = t.returnHome;

    // Update Form Labels & Placeholders
    if (document.getElementById("lbl-fullname")) document.getElementById("lbl-fullname").innerText = t.lblFullname;
    if (document.getElementById("lbl-email")) document.getElementById("lbl-email").innerText = t.lblEmail;
    if (document.getElementById("lbl-phone")) document.getElementById("lbl-phone").innerText = t.lblPhone;
    if (document.getElementById("lbl-nationality")) document.getElementById("lbl-nationality").innerText = t.lblNationality;
    if (document.getElementById("lbl-position")) document.getElementById("lbl-position").innerText = t.lblPosition;
    if (document.getElementById("opt-select-pos")) document.getElementById("opt-select-pos").innerText = t.optSelectPos;
    if (document.getElementById("lbl-age")) document.getElementById("lbl-age").innerText = t.lblAge;
    if (document.getElementById("lbl-foot")) document.getElementById("lbl-foot").innerText = t.lblFoot;
    if (document.getElementById("opt-select-foot")) document.getElementById("opt-select-foot").innerText = t.optSelectFoot;
    if (document.getElementById("opt-left")) document.getElementById("opt-left").innerText = t.optLeft;
    if (document.getElementById("opt-right")) document.getElementById("opt-right").innerText = t.optRight;
    if (document.getElementById("opt-both")) document.getElementById("opt-both").innerText = t.optBoth;
    if (document.getElementById("lbl-height")) document.getElementById("lbl-height").innerText = t.lblHeight;
    if (document.getElementById("lbl-video")) document.getElementById("lbl-video").innerText = t.lblVideo;
    if (document.getElementById("lbl-photo")) document.getElementById("lbl-photo").innerText = t.lblPhoto;
    if (document.getElementById("lbl-bio")) document.getElementById("lbl-bio").innerText = t.lblBio;
    if (document.getElementById("submit-btn")) document.getElementById("submit-btn").innerText = t.submitBtn;

    // Update Footer
    if (document.getElementById("footer-copy")) document.getElementById("footer-copy").innerText = t.footerCopy;
    if (document.getElementById("footer-support")) document.getElementById("footer-support").innerText = t.footerSupport;
}

const langToggleBtn = document.getElementById("lang-toggle-btn");
if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
        currentLang = currentLang === "en" ? "fr" : "en";
        localStorage.setItem("tcs_lang", currentLang);
        updatePageLanguage();
    });
}

// Run language mapper on page load
updatePageLanguage();

// ==========================================
// 1. REGISTRATION LOGIC (register.html)
// ==========================================
const registrationForm = document.getElementById("registration-form");
const successCard = document.getElementById("success-card");
const whatsappNotifyBtn = document.getElementById("whatsapp-notify-btn");

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

            registrationForm.classList.add("hidden");
            if (successCard && whatsappNotifyBtn) {
                const msgText = currentLang === 'fr' 
                    ? `Bonjour Directeur, je viens de soumettre mon dossier d'enregistrement sur TCS Talent Hub.\n\nNom: ${fullName}\nPoste: ${position}\nTéléphone: ${phone}\n\nVeuillez examiner et approuver mon profil. Merci !`
                    : `Hello Director, I have just submitted my player registration dossier on TCS Talent Hub.\n\nName: ${fullName}\nPosition: ${position}\nPhone: ${phone}\n\nPlease review and approve my profile. Thank you!`;
                
                const whatsappMessage = encodeURIComponent(msgText);
                whatsappNotifyBtn.href = `https://wa.me/233531919451?text=${whatsappMessage}`;
                successCard.classList.remove("hidden");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

        } catch (error) {
            console.error("Error submitting registration: ", error);
            alert(currentLang === 'fr' ? "Erreur lors de l'enregistrement. Veuillez vérifier votre connexion." : "Error saving registration to database. Please check your network connection and try again.");
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

            <button class="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-lg transition text-sm border border-slate-700 text-center">
                View Full Dossier & Video
            </button>
        `;

        playerCard.addEventListener("click", () => {
            openPlayerModal(player);
        });

        playerGrid.appendChild(playerCard);
    });
}

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
    document.body.style.overflow = "hidden";
}

function closePlayerModal() {
    if (!playerModal) return;
    playerModal.classList.add("hidden");
    document.body.style.overflow = "auto";
}

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closePlayerModal);
}

if (playerModal) {
    playerModal.addEventListener("click", (e) => {
        if (e.target === playerModal) {
            closePlayerModal();
        }
    });
}

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
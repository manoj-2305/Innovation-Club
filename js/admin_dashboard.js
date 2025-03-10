document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".sidebar-menu > li[data-tab]");
    const subMenus = document.querySelectorAll(".submenu li[data-tab]");
    const studentTab = document.querySelector("[data-tab='students']");
    const studentSubMenu = studentTab.querySelector(".submenu");
    const tabContents = document.querySelectorAll(".tab-content");
    const logoutBtn = document.querySelector(".logout-btn");
    let studentForm = document.getElementById("studentForm");
    const studentCount = document.getElementById("studentCount");
    const searchInput = document.getElementById("studentSearch");
    const studentTable = document.getElementById("manageStudentsTable");
    const filterYear = document.getElementById("filterYear");
    const filterDepartment = document.getElementById("filterDepartment");
    const toggleFilterBtn = document.getElementById("toggleFilter");
    const filterOptions = document.getElementById("filterOptions");
    const studentPopup = document.getElementById("studentPopup");
    const openStudentFormBtn = document.getElementById("openStudentForm");
    const closeStudentFormBtn = document.getElementById("closeStudentForm");
    const menuToggle = document.querySelector(".menu-toggle2");
    const sidebar = document.querySelector(".sidebar");
    const menuItems = document.querySelectorAll(".sidebar-menu > li");
    const submenuItems = document.querySelectorAll(".submenu li");
    const inboxTab = document.querySelector("[data-tab='inbox']");
    const inboxSubMenu = inboxTab.querySelector(".submenu");
    

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            const adminId = sessionStorage.getItem("admin_id"); // Get admin_id from sessionStorage (if stored)

            fetch("/innovation_club/php/admin/admin_logout.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `admin_id=${encodeURIComponent(adminId)}`, // Send admin_id
                credentials: "include"
            })
            .then(response => response.json()) // Expect JSON response
            .then(data => {
                console.log("Logout Response:", data); // Debugging
                if (data.status === "success") {
                    window.location.href = data.redirect; // Redirect on success
                } else {
                    alert("Logout failed: " + data.message); // Show error if it fails
                }
            })
            .catch(error => console.error("Logout error:", error));
        });
    }
    fetch("/INNOVATION_CLUB/php/admin/get_admin_profile.php")
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("admin_id").value = data.admin_id;
            document.getElementById("adminname").value = data.adminname;
            document.getElementById("phone_number").value = data.phone_number;
            document.getElementById("emailprofile").value = data.email;

        } else {
            console.error("Error loading profile:", data.message);
        }
    })
    .catch(error => console.error("Error fetching profile:", error));

    inboxTab.addEventListener("click", function (event) {
        // Close all other submenus
        document.querySelectorAll(".submenu").forEach(sub => {
            if (sub !== inboxSubMenu) {
                sub.classList.remove("active");
                sub.style.display = "none";
            }
        });
        
        // Toggle inbox submenu
        inboxSubMenu.style.display = inboxSubMenu.style.display === "block" ? "none" : "block";
        event.stopPropagation();
    });
    
    // Close inbox submenu when selecting another menu item
    document.querySelectorAll(".sidebar-menu > li[data-tab]:not([data-tab='inbox'])").forEach(item => {
        item.addEventListener("click", function () {
            inboxSubMenu.style.display = "none";
        });
    });
    
    // Close inbox submenu when clicking outside
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".sidebar-menu > li[data-tab='inbox']")) {
            inboxSubMenu.style.display = "none";
        }
    });
    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("active");
    });

    // Handle clicks on menu items
    menuItems.forEach(item => {
        item.addEventListener("click", function (event) {
            const submenu = item.querySelector(".submenu");

            if (submenu) {
                // If submenu exists, toggle it and prevent sidebar from closing
                submenu.classList.toggle("active");
                event.stopPropagation(); // Prevent parent click event from triggering
            } else {
                // If no submenu, close the sidebar
                sidebar.classList.remove("active");
            }
        });
    });

    // Close sidebar when a submenu item is clicked
    submenuItems.forEach(subItem => {
        subItem.addEventListener("click", function () {
            sidebar.classList.remove("active");
        });
    });
    openStudentFormBtn.addEventListener("click", function () {
        studentPopup.classList.remove("hidden");
        document.body.classList.add("popup-active");
    });

    // Hide popup when clicking "Cancel" button
    closeStudentFormBtn.addEventListener("click", function () {
        studentPopup.classList.add("hidden");
        document.body.classList.remove("popup-active");
    });

    // Close popup when clicking outside the form
    studentPopup.addEventListener("click", function (event) {
        if (event.target === studentPopup) {
            studentPopup.classList.add("hidden");
            document.body.classList.remove("popup-active");
        }
    });
    toggleFilterBtn.addEventListener("click", function () {
        filterOptions.style.display = (filterOptions.style.display === "flex") ? "none" : "flex";
    });

    function filterStudents() {
        const searchFilter = searchInput.value.toLowerCase();
        const yearFilter = filterYear.value;
        const deptFilter = filterDepartment.value;
        const rows = studentTable.getElementsByTagName("tr");

        for (let i = 0; i < rows.length; i++) {
            let nameCell = rows[i].getElementsByTagName("td")[0];  // Name column
            let regNoCell = rows[i].getElementsByTagName("td")[1]; // Reg No column
            let yearCell = rows[i].getElementsByTagName("td")[2];  // Year column
            let deptCell = rows[i].getElementsByTagName("td")[3];  // Department column

            if (nameCell && regNoCell && yearCell && deptCell) {
                let name = nameCell.textContent.toLowerCase();
                let regNo = regNoCell.textContent.toLowerCase();
                let year = yearCell.textContent.trim();
                let dept = deptCell.textContent.trim();

                let matchesSearch = name.includes(searchFilter) || regNo.includes(searchFilter);
                let matchesYear = yearFilter === "" || year === yearFilter;
                let matchesDept = deptFilter === "" || dept === deptFilter;

                rows[i].style.display = (matchesSearch && matchesYear && matchesDept) ? "" : "none";
            }
        }
    }

    // Attach event listeners for real-time filtering
    searchInput.addEventListener("keyup", filterStudents);
    filterYear.addEventListener("change", filterStudents);
    filterDepartment.addEventListener("change", filterStudents);
    if (searchInput && studentTable) {
        searchInput.addEventListener("keyup", function () {
            const filter = searchInput.value.toLowerCase();
            const rows = studentTable.getElementsByTagName("tr");

            for (let i = 0; i < rows.length; i++) {
                let nameCell = rows[i].getElementsByTagName("td")[0]; // Name column
                let regNoCell = rows[i].getElementsByTagName("td")[1]; // Reg No column

                if (nameCell && regNoCell) {
                    let name = nameCell.textContent || nameCell.innerText;
                    let regNo = regNoCell.textContent || regNoCell.innerText;

                    // Show row if the name OR reg no matches the search query
                    if (name.toLowerCase().includes(filter) || regNo.toLowerCase().includes(filter)) {
                        rows[i].style.display = "";
                    } else {
                        rows[i].style.display = "none";
                    }
                }
            }
        });
    }
    if (studentCount) {
        studentCount.addEventListener("click", function () {
            // Hide all tabs
            document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
            
            // Show Manage Students tab
            document.getElementById("manageStudents").classList.add("active");

            // Remove active class from sidebar items
            document.querySelectorAll(".sidebar-menu li").forEach(item => item.classList.remove("active"));

            // Add active class to the correct tab
            document.querySelector("[data-tab='manageStudents']").classList.add("active");
        });
    }

    studentSubMenu.style.display = "none";

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            showTab(tab.dataset.tab);
            removeActiveClass([...tabs, ...subMenus]);
            setActiveItem(tab);

            // Toggle submenu visibility
            if (tab.dataset.tab === "students") {
                studentSubMenu.style.display = studentSubMenu.style.display === "block" ? "none" : "block";
            } else {
                studentSubMenu.style.display = "none";
            }
        });
    });

    subMenus.forEach(subTab => {
        subTab.addEventListener("click", function (event) {
            event.stopPropagation();
            showTab(subTab.dataset.tab);
            removeActiveClass([...tabs, ...subMenus]);
            setActiveItem(subTab);

            // Remove glow from the main student button when submenu is clicked
            studentTab.classList.remove("active");
        });
    });

    function showTab(tabName) {
        tabContents.forEach(content => {
            content.style.display = content.id === tabName ? "block" : "none";
        });
    }

    function setActiveItem(selectedItem) {
        removeActiveClass([...tabs, ...subMenus]);
        selectedItem.classList.add("active");
    }

    function removeActiveClass(menuItems) {
        menuItems.forEach(item => item.classList.remove("active"));
    }

    if (studentForm) {
        attachFormListener();
    }

    function attachFormListener() {
        studentForm.removeEventListener("submit", handleFormSubmit);
        studentForm.addEventListener("submit", handleFormSubmit);
    }

    function loadRecentStudents() {
        fetch("/INNOVATION_CLUB/php/admin/fetch_students.php")
            .then(response => response.json())
            .then(data => {
                const recentStudentsTable = document.getElementById("recentStudentsTable");
                if (!recentStudentsTable) {
                    console.error("recentStudentsTable not found!");
                    return;
                }
                recentStudentsTable.innerHTML = "";
    
                if (data.length === 0) {
                    recentStudentsTable.innerHTML = "<tr><td colspan='5'>No students added today.</td></tr>";
                    return;
                }
    
                data.forEach(student => {
                    let row = `<tr>
                        <td>${student.name}</td>
                        <td>${student.reg_no}</td>
                        <td>${student.year}</td>
                        <td>${student.department}</td>
                        <td>${student.email}</td>
                    </tr>`;
                    recentStudentsTable.innerHTML += row;
                });
            })
            .catch(error => console.error("Error:", error));
    }
    loadAllStudents();
    function loadAllStudents() {
        fetch("/INNOVATION_CLUB/php/admin/fetch_all_students.php")
            .then(response => response.json())
            .then(data => {
                const manageStudentsTable = document.getElementById("manageStudentsTable");
                if (!manageStudentsTable) {
                    console.error("manageStudentsTable not found!");
                    return;
                }
                manageStudentsTable.innerHTML = "";
    
                if (data.length === 0) {
                    manageStudentsTable.innerHTML = "<tr><td colspan='6'>No students found.</td></tr>";
                    return;
                }
    
                data.forEach(student => {
                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${student.name}</td>
                        <td>${student.reg_no}</td>
                        <td>${student.year}</td>
                        <td>${student.department}</td>
                        <td>${student.email}</td>
                        <td>
                            <button class="delete-btn" data-regno="${student.reg_no}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    `;
    
                    manageStudentsTable.appendChild(row);
                });
    
                // Attach event listeners to delete buttons
                document.querySelectorAll(".delete-btn").forEach(button => {
                    button.addEventListener("click", function () {
                        let regNo = this.getAttribute("data-regno");
                        deleteStudent(regNo);
                    });
                });
            })
            .catch(error => console.error("Error:", error));
    }
    
    function showMessage(type, message) {
        if (type === "success") {
            document.getElementById("successText").innerText = message;
            document.getElementById("successMessage").style.display = "block";
            document.getElementById("errorMessage").style.display = "none";
        } else {
            document.getElementById("errorText").innerText = message;
            document.getElementById("errorMessage").style.display = "block";
            document.getElementById("successMessage").style.display = "none";
        }
    
        // Hide message after 3 seconds
        setTimeout(() => {
            document.getElementById("successMessage").style.display = "none";
            document.getElementById("errorMessage").style.display = "none";
        }, 3000);
    }
    
    function deleteStudent(regNo) {
        if (!confirm("Are you sure you want to delete this student?")) return;
    
        fetch("/INNOVATION_CLUB/php/admin/delete_student.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `reg_no=${regNo}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                showMessage("success", "Student deleted successfully.");
                loadAllStudents();
            } else {
                showMessage("error", "Error: " + data.message);
            }
        })
        .catch(error => {
            showMessage("error", "An error occurred while deleting.");
            console.error("Error:", error);
        });
    }
    
    

    loadRecentStudents();
    function loadStudentCount() {
        fetch("/INNOVATION_CLUB/php/admin/fetch_student_count.php")
            .then(response => response.json())
            .then(data => {
                console.log("Student count fetched:", data);  // ✅ Debugging
                const studentCountElement = document.getElementById("studentCount");
                if (studentCountElement) {
                    studentCountElement.textContent = data.total_students;
                } else {
                    console.error("Student count element not found!");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("studentCount").textContent = "Error loading data";
            });
    }

    // ✅ Call this directly instead of wrapping inside another event listener
    loadStudentCount();
    loadRecentStudents();

    function handleFormSubmit(event) {
        event.preventDefault();
    
        let formData = new FormData(studentForm);
    
        fetch("/INNOVATION_CLUB/php/admin/add_student_admin.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            
            const messageBox = document.getElementById("messageBox");
            messageBox.innerHTML = ""; // Clear previous messages
    
            if (data.status === "success") {
                messageBox.innerHTML = `<div class="success-message">${data.message}</div>`;
                studentForm.reset(); // Clear the form
                loadRecentStudents(); // Refresh student list
            } else {
                let errorMessages = `<div class="error-message">`;
                data.errors.forEach(error => {
                    errorMessages += `<p>⚠️ ${error}</p>`;
                });
                errorMessages += `</div>`;
                messageBox.innerHTML = errorMessages;
            }
        })
        .catch(error => console.error("Error:", error));
    }
    loadRecentStudents(); 
     // Ensure recent students load on page load
});

/**
 * Dashboard Scripts
 * Handles specific dashboard functionalities (Tabs, Charts, Skeleton Loaders)
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  simulateLoading();
});

/**
 * Tab Navigation in Dashboard
 */
function initDashboardTabs() {
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (tabLinks.length > 0 && tabPanes.length > 0) {
    tabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links and panes
        tabLinks.forEach(item => item.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to clicked link and corresponding pane
        link.classList.add('active');
        const targetId = link.getAttribute('data-target');
        const targetPane = document.getElementById(targetId);
        
        if (targetPane) {
          targetPane.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }
}

/**
 * Simulate Loading (for demonstrating skeleton loaders)
 */
function simulateLoading() {
  const skeletons = document.querySelectorAll('.skeleton-wrapper');
  
  if (skeletons.length > 0) {
    setTimeout(() => {
      skeletons.forEach(skeleton => {
        skeleton.classList.add('loaded');
        // If there's real content inside to reveal, we can toggle classes here
        const actualContent = skeleton.nextElementSibling;
        if (actualContent && actualContent.classList.contains('hidden-content')) {
          skeleton.style.display = 'none';
          actualContent.classList.remove('hidden-content');
        }
      });
    }, 2000); // Simulate a 2 second load time
  }
}

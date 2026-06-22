const periodicTable = document.getElementById('periodicTable');
const multipleInput = document.getElementById('multipleInput');
const clearButton = document.getElementById('clearButton');

const elements = [
  { number: 1, symbol: 'H', name: '氫', mass: '1.008', period: 1, group: 1, category: 'nonmetal' },
  { number: 2, symbol: 'He', name: '氦', mass: '4.0026', period: 1, group: 18, category: 'noble-gas' },
  { number: 3, symbol: 'Li', name: '鋰', mass: '6.94', period: 2, group: 1, category: 'alkali' },
  { number: 4, symbol: 'Be', name: '鈹', mass: '9.0122', period: 2, group: 2, category: 'alkaline' },
  { number: 5, symbol: 'B', name: '硼', mass: '10.81', period: 2, group: 13, category: 'metalloid' },
  { number: 6, symbol: 'C', name: '碳', mass: '12.011', period: 2, group: 14, category: 'nonmetal' },
  { number: 7, symbol: 'N', name: '氮', mass: '14.007', period: 2, group: 15, category: 'nonmetal' },
  { number: 8, symbol: 'O', name: '氧', mass: '15.999', period: 2, group: 16, category: 'nonmetal' },
  { number: 9, symbol: 'F', name: '氟', mass: '18.998', period: 2, group: 17, category: 'halogen' },
  { number: 10, symbol: 'Ne', name: '氖', mass: '20.180', period: 2, group: 18, category: 'noble-gas' },
  { number: 11, symbol: 'Na', name: '鈉', mass: '22.990', period: 3, group: 1, category: 'alkali' },
  { number: 12, symbol: 'Mg', name: '鎂', mass: '24.305', period: 3, group: 2, category: 'alkaline' },
  { number: 13, symbol: 'Al', name: '鋁', mass: '26.982', period: 3, group: 13, category: 'post-transition' },
  { number: 14, symbol: 'Si', name: '矽', mass: '28.085', period: 3, group: 14, category: 'metalloid' },
  { number: 15, symbol: 'P', name: '磷', mass: '30.974', period: 3, group: 15, category: 'nonmetal' },
  { number: 16, symbol: 'S', name: '硫', mass: '32.06', period: 3, group: 16, category: 'nonmetal' },
  { number: 17, symbol: 'Cl', name: '氯', mass: '35.45', period: 3, group: 17, category: 'halogen' },
  { number: 18, symbol: 'Ar', name: '氬', mass: '39.948', period: 3, group: 18, category: 'noble-gas' },
  { number: 19, symbol: 'K', name: '鉀', mass: '39.098', period: 4, group: 1, category: 'alkali' },
  { number: 20, symbol: 'Ca', name: '鈣', mass: '40.078', period: 4, group: 2, category: 'alkaline' },
  { number: 21, symbol: 'Sc', name: '鈧', mass: '44.956', period: 4, group: 3, category: 'transition' },
  { number: 22, symbol: 'Ti', name: '鈦', mass: '47.867', period: 4, group: 4, category: 'transition' },
  { number: 23, symbol: 'V', name: '釩', mass: '50.942', period: 4, group: 5, category: 'transition' },
  { number: 24, symbol: 'Cr', name: '鉻', mass: '51.996', period: 4, group: 6, category: 'transition' },
  { number: 25, symbol: 'Mn', name: '錳', mass: '54.938', period: 4, group: 7, category: 'transition' },
  { number: 26, symbol: 'Fe', name: '鐵', mass: '55.845', period: 4, group: 8, category: 'transition' },
  { number: 27, symbol: 'Co', name: '鈷', mass: '58.933', period: 4, group: 9, category: 'transition' },
  { number: 28, symbol: 'Ni', name: '鎳', mass: '58.693', period: 4, group: 10, category: 'transition' },
  { number: 29, symbol: 'Cu', name: '銅', mass: '63.546', period: 4, group: 11, category: 'transition' },
  { number: 30, symbol: 'Zn', name: '鋅', mass: '65.38', period: 4, group: 12, category: 'transition' },
  { number: 31, symbol: 'Ga', name: '鎵', mass: '69.723', period: 4, group: 13, category: 'post-transition' },
  { number: 32, symbol: 'Ge', name: '鍺', mass: '72.630', period: 4, group: 14, category: 'metalloid' },
  { number: 33, symbol: 'As', name: '砷', mass: '74.922', period: 4, group: 15, category: 'metalloid' },
  { number: 34, symbol: 'Se', name: '硒', mass: '78.971', period: 4, group: 16, category: 'nonmetal' },
  { number: 35, symbol: 'Br', name: '溴', mass: '79.904', period: 4, group: 17, category: 'halogen' },
  { number: 36, symbol: 'Kr', name: '氪', mass: '83.798', period: 4, group: 18, category: 'noble-gas' },
  { number: 37, symbol: 'Rb', name: '銣', mass: '85.468', period: 5, group: 1, category: 'alkali' },
  { number: 38, symbol: 'Sr', name: '鍶', mass: '87.62', period: 5, group: 2, category: 'alkaline' },
  { number: 39, symbol: 'Y', name: '釔', mass: '88.906', period: 5, group: 3, category: 'transition' },
  { number: 40, symbol: 'Zr', name: '鋯', mass: '91.224', period: 5, group: 4, category: 'transition' },
  { number: 41, symbol: 'Nb', name: '鈮', mass: '92.906', period: 5, group: 5, category: 'transition' },
  { number: 42, symbol: 'Mo', name: '鉬', mass: '95.95', period: 5, group: 6, category: 'transition' },
  { number: 43, symbol: 'Tc', name: '鎝', mass: '(98)', period: 5, group: 7, category: 'transition' },
  { number: 44, symbol: 'Ru', name: '鈀', mass: '101.07', period: 5, group: 8, category: 'transition' },
  { number: 45, symbol: 'Rh', name: '銠', mass: '102.91', period: 5, group: 9, category: 'transition' },
  { number: 46, symbol: 'Pd', name: '鈀', mass: '106.42', period: 5, group: 10, category: 'transition' },
  { number: 47, symbol: 'Ag', name: '銀', mass: '107.87', period: 5, group: 11, category: 'transition' },
  { number: 48, symbol: 'Cd', name: '鎘', mass: '112.41', period: 5, group: 12, category: 'transition' },
  { number: 49, symbol: 'In', name: '銦', mass: '114.82', period: 5, group: 13, category: 'post-transition' },
  { number: 50, symbol: 'Sn', name: '錫', mass: '118.71', period: 5, group: 14, category: 'post-transition' },
  { number: 51, symbol: 'Sb', name: '銻', mass: '121.76', period: 5, group: 15, category: 'metalloid' },
  { number: 52, symbol: 'Te', name: '碲', mass: '127.60', period: 5, group: 16, category: 'metalloid' },
  { number: 53, symbol: 'I', name: '碘', mass: '126.90', period: 5, group: 17, category: 'halogen' },
  { number: 54, symbol: 'Xe', name: '氙', mass: '131.29', period: 5, group: 18, category: 'noble-gas' },
  { number: 55, symbol: 'Cs', name: '銫', mass: '132.91', period: 6, group: 1, category: 'alkali' },
  { number: 56, symbol: 'Ba', name: '鋇', mass: '137.33', period: 6, group: 2, category: 'alkaline' },
  { number: 57, symbol: 'La', name: '鑭', mass: '138.91', period: 6, group: 3, category: 'lanthanoid' },
  { number: 58, symbol: 'Ce', name: '鈰', mass: '140.12', period: 8, group: 4, category: 'lanthanoid' },
  { number: 59, symbol: 'Pr', name: '鐠', mass: '140.91', period: 8, group: 5, category: 'lanthanoid' },
  { number: 60, symbol: 'Nd', name: '釹', mass: '144.24', period: 8, group: 6, category: 'lanthanoid' },
  { number: 61, symbol: 'Pm', name: '釙', mass: '(145)', period: 8, group: 7, category: 'lanthanoid' },
  { number: 62, symbol: 'Sm', name: '釤', mass: '150.36', period: 8, group: 8, category: 'lanthanoid' },
  { number: 63, symbol: 'Eu', name: '銪', mass: '151.96', period: 8, group: 9, category: 'lanthanoid' },
  { number: 64, symbol: 'Gd', name: '釓', mass: '157.25', period: 8, group: 10, category: 'lanthanoid' },
  { number: 65, symbol: 'Tb', name: '鉺', mass: '158.93', period: 8, group: 11, category: 'lanthanoid' },
  { number: 66, symbol: 'Dy', name: '鏑', mass: '162.50', period: 8, group: 12, category: 'lanthanoid' },
  { number: 67, symbol: 'Ho', name: '鈥', mass: '164.93', period: 8, group: 13, category: 'lanthanoid' },
  { number: 68, symbol: 'Er', name: '鉺', mass: '167.26', period: 8, group: 14, category: 'lanthanoid' },
  { number: 69, symbol: 'Tm', name: '銩', mass: '168.93', period: 8, group: 15, category: 'lanthanoid' },
  { number: 70, symbol: 'Yb', name: '鏑', mass: '173.05', period: 8, group: 16, category: 'lanthanoid' },
  { number: 71, symbol: 'Lu', name: '鑥', mass: '174.97', period: 8, group: 17, category: 'lanthanoid' },
  { number: 72, symbol: 'Hf', name: '鉿', mass: '178.49', period: 6, group: 4, category: 'transition' },
  { number: 73, symbol: 'Ta', name: '鉭', mass: '180.95', period: 6, group: 5, category: 'transition' },
  { number: 74, symbol: 'W', name: '鎢', mass: '183.84', period: 6, group: 6, category: 'transition' },
  { number: 75, symbol: 'Re', name: '銠', mass: '186.21', period: 6, group: 7, category: 'transition' },
  { number: 76, symbol: 'Os', name: '錼', mass: '190.23', period: 6, group: 8, category: 'transition' },
  { number: 77, symbol: 'Ir', name: '鋱', mass: '192.22', period: 6, group: 9, category: 'transition' },
  { number: 78, symbol: 'Pt', name: '鉑', mass: '195.08', period: 6, group: 10, category: 'transition' },
  { number: 79, symbol: 'Au', name: '金', mass: '196.97', period: 6, group: 11, category: 'transition' },
  { number: 80, symbol: 'Hg', name: '汞', mass: '200.59', period: 6, group: 12, category: 'transition' },
  { number: 81, symbol: 'Tl', name: '鉈', mass: '204.38', period: 6, group: 13, category: 'post-transition' },
  { number: 82, symbol: 'Pb', name: '鉛', mass: '207.2', period: 6, group: 14, category: 'post-transition' },
  { number: 83, symbol: 'Bi', name: '鉍', mass: '208.98', period: 6, group: 15, category: 'post-transition' },
  { number: 84, symbol: 'Po', name: '釙', mass: '(209)', period: 6, group: 16, category: 'metalloid' },
  { number: 85, symbol: 'At', name: '砹', mass: '(210)', period: 6, group: 17, category: 'halogen' },
  { number: 86, symbol: 'Rn', name: '氡', mass: '(222)', period: 6, group: 18, category: 'noble-gas' },
  { number: 87, symbol: 'Fr', name: '釙', mass: '(223)', period: 7, group: 1, category: 'alkali' },
  { number: 88, symbol: 'Ra', name: '鐳', mass: '(226)', period: 7, group: 2, category: 'alkaline' },
  { number: 89, symbol: 'Ac', name: '錒', mass: '(227)', period: 7, group: 3, category: 'actinoid' },
  { number: 90, symbol: 'Th', name: '釷', mass: '232.04', period: 9, group: 4, category: 'actinoid' },
  { number: 91, symbol: 'Pa', name: '鏷', mass: '231.04', period: 9, group: 5, category: 'actinoid' },
  { number: 92, symbol: 'U', name: '鈾', mass: '238.03', period: 9, group: 6, category: 'actinoid' },
  { number: 93, symbol: 'Np', name: '镎', mass: '(237)', period: 9, group: 7, category: 'actinoid' },
  { number: 94, symbol: 'Pu', name: '鈽', mass: '(244)', period: 9, group: 8, category: 'actinoid' },
  { number: 95, symbol: 'Am', name: '镅', mass: '(243)', period: 9, group: 9, category: 'actinoid' },
  { number: 96, symbol: 'Cm', name: '鈽', mass: '(247)', period: 9, group: 10, category: 'actinoid' },
  { number: 97, symbol: 'Bk', name: '锫', mass: '(247)', period: 9, group: 11, category: 'actinoid' },
  { number: 98, symbol: 'Cf', name: '鈽', mass: '(251)', period: 9, group: 12, category: 'actinoid' },
  { number: 99, symbol: 'Es', name: '鋱', mass: '(252)', period: 9, group: 13, category: 'actinoid' },
  { number: 100, symbol: 'Fm', name: '鍩', mass: '(257)', period: 9, group: 14, category: 'actinoid' },
  { number: 101, symbol: 'Md', name: '鈁', mass: '(258)', period: 9, group: 15, category: 'actinoid' },
  { number: 102, symbol: 'No', name: '𬬻', mass: '(259)', period: 9, group: 16, category: 'actinoid' },
  { number: 103, symbol: 'Lr', name: '鐒', mass: '(262)', period: 9, group: 17, category: 'actinoid' },
  { number: 104, symbol: 'Rf', name: '𫓧', mass: '(267)', period: 7, group: 4, category: 'transition' },
  { number: 105, symbol: 'Db', name: '𫓧', mass: '(268)', period: 7, group: 5, category: 'transition' },
  { number: 106, symbol: 'Sg', name: '𫓧', mass: '(269)', period: 7, group: 6, category: 'transition' },
  { number: 107, symbol: 'Bh', name: '𫓧', mass: '(270)', period: 7, group: 7, category: 'transition' },
  { number: 108, symbol: 'Hs', name: '𫓧', mass: '(269)', period: 7, group: 8, category: 'transition' },
  { number: 109, symbol: 'Mt', name: '𫓧', mass: '(278)', period: 7, group: 9, category: 'transition' },
  { number: 110, symbol: 'Ds', name: '𫓧', mass: '(281)', period: 7, group: 10, category: 'transition' },
  { number: 111, symbol: 'Rg', name: '𫓧', mass: '(282)', period: 7, group: 11, category: 'transition' },
  { number: 112, symbol: 'Cn', name: '𫓧', mass: '(285)', period: 7, group: 12, category: 'transition' },
  { number: 113, symbol: 'Nh', name: '𫓧', mass: '(286)', period: 7, group: 13, category: 'post-transition' },
  { number: 114, symbol: 'Fl', name: '𫓧', mass: '(289)', period: 7, group: 14, category: 'post-transition' },
  { number: 115, symbol: 'Mc', name: '𫓧', mass: '(290)', period: 7, group: 15, category: 'post-transition' },
  { number: 116, symbol: 'Lv', name: '𫓧', mass: '(293)', period: 7, group: 16, category: 'post-transition' },
  { number: 117, symbol: 'Ts', name: '𫓧', mass: '(294)', period: 7, group: 17, category: 'halogen' },
  { number: 118, symbol: 'Og', name: '𫓧', mass: '(294)', period: 7, group: 18, category: 'noble-gas' }
];

function renderElements(filterNumber = null) {
  periodicTable.innerHTML = '';

  elements.forEach(element => {
    const card = document.createElement('article');
    card.className = `element-card ${element.category}`;
    if (filterNumber && element.number % filterNumber === 0) {
      card.classList.add('highlight');
    }

    card.style.gridColumn = element.group;
    card.style.gridRow = element.period;
    card.innerHTML = `
      <span class="atomic-number">${element.number}</span>
      <strong class="symbol">${element.symbol}</strong>
      <div class="name">${element.name}</div>
      <div class="mass">${element.mass}</div>
    `;
    periodicTable.appendChild(card);
  });
}

function updateHighlights() {
  const value = Number(multipleInput.value);
  const filterNumber = value > 0 ? value : null;
  renderElements(filterNumber);
}

multipleInput.addEventListener('input', updateHighlights);
clearButton.addEventListener('click', () => {
  multipleInput.value = '';
  renderElements(null);
});

renderElements();

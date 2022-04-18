interface Note {
    id: number;
    content: string;
}

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 36;
const noteToggles = document.querySelectorAll(
    '[data-item]'
) as NodeListOf<HTMLUListElement>;
const textContent = document.querySelector('textarea') as HTMLTextAreaElement;
const inc = document.querySelector('.inc') as HTMLDivElement;
const dec = document.querySelector('.dec') as HTMLDivElement;

noteToggles.forEach(onNoteToggle);

inc.addEventListener('click', () => updateFontSize(true));
dec.addEventListener('click', () => updateFontSize(false));

textContent.addEventListener('input', onNoteUpdate);

function initializeNotes() {
    if (localStorage.getItem('notes') == null) {
        const init = [
            { id: 1, content: '' },
            { id: 2, content: '' },
            { id: 3, content: '' },
            { id: 4, content: '' },
            { id: 5, content: '' },
            { id: 6, content: '' },
            { id: 7, content: '' },
            { id: 8, content: '' },
        ];

        localStorage.setItem('notes', JSON.stringify(init));
    }
}

function initializeCurrentPage() {
    if (localStorage.getItem('currentPage') == null) {
        localStorage.setItem('currentPage', '1');
    }
}

function initializeFontSize() {
    if (localStorage.getItem('fontSize') == null) {
        localStorage.setItem('fontSize', '12');
    }

    textContent.style.setProperty(
        '--font-size',
        localStorage.getItem('fontSize')
    );
}

function updateNoteContents() {
    if (
        localStorage.getItem('notes') != null &&
        localStorage.getItem('currentPage') != null
    ) {
        const notes = JSON.parse(
            localStorage.getItem('notes') as string
        ) as Array<Note>;
        const currentPage = parseInt(
            localStorage.getItem('currentPage') as string
        );
        textContent.value = notes[currentPage - 1].content;

        updateNavigation();
    }
}

function updateFontSize(inc: boolean = true) {
    if (localStorage.getItem('fontSize') == null) return;

    const value = inc ? 2 : -2;
    const newSize =
        parseInt(localStorage.getItem('fontSize') as string) + value;

    if (newSize > MAX_FONT_SIZE || newSize < MIN_FONT_SIZE) return;

    textContent.style.setProperty('--font-size', newSize.toString());
    localStorage.setItem('fontSize', newSize.toString());
}

function updateNavigation() {
    noteToggles.forEach((item) => item.classList.remove('active'));

    [...noteToggles]
        .filter(
            (toggle) =>
                parseInt(toggle.dataset.item as string) ===
                parseInt(localStorage.getItem('currentPage') as string)
        )
        .forEach((item) => item.classList.add('active'));
}

function onNoteToggle(item: HTMLUListElement) {
    item.addEventListener('click', (e: any) => {
        if (
            localStorage.getItem('notes') == null ||
            localStorage.getItem('currentPage') == null
        )
            return;

        const id = e.target.dataset.item;
        localStorage.setItem('currentPage', id);
        updateNoteContents();
    });
}

function onNoteUpdate(e: any) {
    if (localStorage.getItem('currentPage') == null) return;

    const obj: Array<Note> = JSON.parse(
        localStorage.getItem('notes') as string
    );
    const currentPage: number = parseInt(
        localStorage.getItem('currentPage') as string
    );

    obj[currentPage - 1].content = e.target.value;
    localStorage.setItem('notes', JSON.stringify(obj));
}

initializeNotes();
initializeCurrentPage();
initializeFontSize();
updateNoteContents();

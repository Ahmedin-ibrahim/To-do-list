<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A focused, local to-do list for keeping track of what matters today.">
    <title>Daymark | To-do list</title>
    <style>
        :root {
            --ink: #1b2a2a;
            --muted: #687777;
            --paper: #f5f3ed;
            --surface: #fffdf8;
            --line: #dce3de;
            --accent: #e36d4f;
            --accent-dark: #bf4f35;
            --mint: #d8e9df;
            --shadow: 0 24px 70px rgba(36, 61, 56, 0.12);
        }

        * { box-sizing: border-box; }

        body {
            min-height: 100vh;
            margin: 0;
            color: var(--ink);
            background: var(--paper);
            font-family: Georgia, "Times New Roman", serif;
        }

        body::before {
            position: fixed;
            inset: 0 0 auto;
            height: 14rem;
            z-index: -1;
            content: "";
            background: linear-gradient(130deg, #c5ded0 0%, #e6ead9 55%, #f5f3ed 100%);
        }

        .app-shell {
            width: min(100% - 2rem, 850px);
            margin: 0 auto;
            padding: 3.75rem 0 4rem;
        }

        .eyebrow {
            margin: 0 0 0.65rem;
            color: #467267;
            font: 700 0.78rem/1.2 Arial, sans-serif;
            letter-spacing: 0.15em;
            text-transform: uppercase;
        }

        h1 {
            max-width: 14ch;
            margin: 0;
            font-size: clamp(2.8rem, 8vw, 5.5rem);
            font-weight: 400;
            line-height: 0.95;
            letter-spacing: -0.05em;
        }

        .intro {
            display: flex;
            align-items: end;
            justify-content: space-between;
            gap: 2rem;
            margin-bottom: 2.5rem;
        }

        .date {
            max-width: 15rem;
            margin: 0 0 0.3rem;
            color: var(--muted);
            font: 0.95rem/1.5 Arial, sans-serif;
            text-align: right;
        }

        .workspace {
            padding: clamp(1.25rem, 4vw, 2.25rem);
            background: rgba(255, 253, 248, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            box-shadow: var(--shadow);
            backdrop-filter: blur(8px);
        }

        form {
            display: flex;
            gap: 0.7rem;
            padding-bottom: 1.7rem;
            border-bottom: 1px solid var(--line);
        }

        input[type="text"] {
            min-width: 0;
            flex: 1;
            padding: 0.95rem 1rem;
            color: var(--ink);
            background: #f7f8f4;
            border: 1px solid var(--line);
            border-radius: 4px;
            outline: none;
            font: 1rem/1.2 Arial, sans-serif;
        }

        input[type="text"]:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(227, 109, 79, 0.14); }

        button {
            border: 0;
            cursor: pointer;
            font: 700 0.82rem/1 Arial, sans-serif;
        }

        .add-button {
            padding: 0 1.3rem;
            color: white;
            background: var(--accent);
            border-radius: 4px;
        }

        .add-button:hover { background: var(--accent-dark); }

        .toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 1.25rem 0 0.75rem;
        }

        .count { margin: 0; color: var(--muted); font: 0.83rem/1.2 Arial, sans-serif; }

        .filters { display: flex; gap: 0.35rem; }
        .filter {
            padding: 0.45rem 0.65rem;
            color: var(--muted);
            background: transparent;
            border-radius: 3px;
        }
        .filter:hover, .filter.active { color: var(--ink); background: var(--mint); }

        #myItem { display: grid; gap: 0.65rem; padding: 0; margin: 0; list-style: none; }

        .task {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 1rem;
            background: white;
            border: 1px solid var(--line);
            border-radius: 4px;
            animation: arrive 240ms ease-out both;
        }

        .task-check {
            width: 1.2rem;
            height: 1.2rem;
            flex: 0 0 auto;
            margin: 0;
            accent-color: var(--accent);
            cursor: pointer;
        }

        .task-text { flex: 1; overflow-wrap: anywhere; font: 1rem/1.4 Arial, sans-serif; }
        .task.completed .task-text { color: var(--muted); text-decoration: line-through; }
        .delete-button { padding: 0.35rem; color: #9aaaa5; background: transparent; font-size: 1rem; }
        .delete-button:hover { color: var(--accent-dark); }

        .empty-state { padding: 2.5rem 1rem 1.75rem; color: var(--muted); text-align: center; font: 0.95rem/1.5 Arial, sans-serif; }
        .empty-state strong { display: block; margin-bottom: 0.3rem; color: var(--ink); font: 1.25rem Georgia, serif; }

        @keyframes arrive { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 560px) {
            .app-shell { padding-top: 2.5rem; }
            .intro { display: block; }
            .date { margin-top: 1rem; text-align: left; }
            form { flex-direction: column; }
            .add-button { min-height: 2.8rem; }
            .toolbar { align-items: start; flex-direction: column-reverse; }
        }
    </style>
</head>
<body>
    <main class="app-shell">
        <header class="intro">
            <div>
                <p class="eyebrow">A little order</p>
                <h1>Make room for what matters.</h1>
            </div>
            <p class="date" id="currentDate"></p>
        </header>

        <section class="workspace" aria-label="To-do list">
            <form id="myForm">
                <input id="myInput" type="text" maxlength="160" placeholder="What needs doing?" aria-label="New task" autocomplete="off">
                <button class="add-button" type="submit">Add task</button>
            </form>
            <div class="toolbar">
                <p class="count" id="taskCount">0 tasks left</p>
                <nav class="filters" aria-label="Filter tasks">
                    <button class="filter active" type="button" data-filter="all">All</button>
                    <button class="filter" type="button" data-filter="active">Open</button>
                    <button class="filter" type="button" data-filter="completed">Done</button>
                </nav>
            </div>
            <ul id="myItem" aria-live="polite"></ul>
        </section>
    </main>
    <script src="script.js"></script>
</body>
</html>

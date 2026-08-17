import re

with open("projects.html", "r") as f:
    content = f.read()

# 1. Add the new filter button
if 'data-filter="functional-programming"' not in content:
    button_html = '                <button class="filter-btn" data-filter="web">Web Applications</button>\n                <button class="filter-btn" data-filter="functional-programming">Functional Programming</button>'
    content = content.replace('                <button class="filter-btn" data-filter="web">Web Applications</button>', button_html)

# 2. Update data-category for the functional programming projects
fp_titles = [
    "OCaml Warmup",
    "Higher-Order Functions on Trees & Database Design",
    "Regular Expression Engine",
    "MicroCaml Lexer, Parser, and Interpreter",
    "Type Inference & Type Checking",
    "Rust Programming & Garbage Collection"
]

for title in fp_titles:
    # Find the block starting before this title, specifically looking for `<div class="project-card"`
    parts = content.split(f'<h3 class="project-title">{title}</h3>')
    if len(parts) > 1:
        # We need to change the data-category in the part BEFORE the title.
        # Let's find the last occurrence of `<div class="project-card" data-category="` in parts[0]
        # and replace it.
        prefix = parts[0]
        last_card_idx = prefix.rfind('<div class="project-card" data-category="')
        
        if last_card_idx != -1:
            # Extract everything from that point to the end of prefix
            card_start = prefix[last_card_idx:]
            
            # Use regex to replace just the data-category in this start snippet
            new_card_start = re.sub(r'data-category="[^"]+"', 'data-category="functional-programming"', card_start, count=1)
            
            # Put it back
            parts[0] = prefix[:last_card_idx] + new_card_start
            
            content = f'<h3 class="project-title">{title}</h3>'.join(parts)

with open("projects.html", "w") as f:
    f.write(content)
print("Updated categories and added button successfully")

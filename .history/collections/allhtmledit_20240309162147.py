import re

def replace_image_refs(html_file):
    with open(html_file, 'r') as file:
        html_content = file.read()

    image_refs = re.findall(r'(?<=src=")(.*?)(?=.jpg)', html_content)

    encountered_refs = set()
    for ref in image_refs:
        if ref not in encountered_refs:
            encountered_refs.add(ref)
            continue
        
        new_ref = f"{ref}{encountered_refs.count(ref):02d}.jpg"
        html_content = html_content.replace(ref + '.jpg', new_ref)

    with open(html_file, 'w') as file:
        file.write(html_content)

# Replace 'your_html_file.html' with the path to your HTML file
replace_image_refs('all.html')

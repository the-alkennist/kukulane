import re

def replace_image_refs(html_file):
    with open(html_file, 'r') as file:
        html_content = file.read()

    image_refs = re.findall(r'(?<=src=")(.*?)(?=.jpg)', html_content)

    for i, ref in enumerate(image_refs):
        new_ref = f"{ref}{i:02d}.jpg"
        html_content = html_content.replace(ref + '.jpg', new_ref)

    with open(html_file, 'w') as file:
        file.write(html_content)

# Replace 'your_html_file.html' with the path to your HTML file
replace_image_refs('your_html_file.html')

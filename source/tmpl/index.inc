<p>If you need 'full-width' content, you should define it outside of the grid-wrapper class like we've done here.</p>

<div class="bbc-news-vj-grid-wrapper">
    <div class="bbc-news-vj-grid-wrapper__fluid-inner">

        <h1>Fluid Grid Wrapper</h1>

        <p><%= made_up_key %></p>

        <p id="show-off-redirect" style="color: indianred; font-weight: bold;"></p>

        <input type="text" placeholder="Type some text here..." id="tmp_text" /> <button>Add content to DOM</button> <button class="button--reset">Reset DOM</button>

        <button class="button--prev">Redirect me</button>

        <ul>
            <li><a href="#" target="_top">Your links' target attribute should always be "_top"</a></li>
            <li>Unordered List Item</li>
            <li>Unordered List Item</li>
        </ul>

        <h2 id="results">Results Section</h3>

        <button class="button--next">Click to scroll</button> <button disabled="disabled">Click for free money</button>
    </div>
</div>

<p>Here's some more full-width content! This could be an image, a canvas, whatever you need.</p>

<div class="bbc-news-vj-grid-wrapper bbc-news-vj-grid-wrapper--fixed">

    <h1>Fixed Grid Wrapper</h1>

    <p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>

    <h2>Form elements</h2>

    <select>
        <option>Item 1</option>
        <option>Item 2</option>
        <option>Item 3</option>
        <option>Item 4</option>
    </select>

    <input type="checkbox" id="cb1"><label for="cb1">Checkbox label</label>
    <input type="checkbox" id="cb2"><label for="cb2">Checkbox label</label>
    <input type="checkbox" id="cb3"><label for="cb3">Checkbox label</label>
    <input type="checkbox" id="cb4"><label for="cb4">Checkbox label</label>
    <input type="checkbox" id="cb5"><label for="cb5">Checkbox label</label>

    <ol>
        <li><a href="#" target="_top">Ordered List Item with Link</a></li>
        <li>Ordered List Item</li>
        <li>Ordered List Item</li>
    </ol>

    <input type="radio" id="rb1" name="radio_btn"><label for="rb1">Radio button label</label>
    <input type="radio" id="rb2" name="radio_btn"><label for="rb2">Radio button label</label>
    <input type="radio" id="rb3" name="radio_btn"><label for="rb3">Radio button label</label>
    <input type="radio" id="rb4" name="radio_btn"><label for="rb4">Radio button label</label>
    <input type="radio" id="rb5" name="radio_btn"><label for="rb5">Radio button label</label>

    <%= include("credits.tmpl") %>
</div>

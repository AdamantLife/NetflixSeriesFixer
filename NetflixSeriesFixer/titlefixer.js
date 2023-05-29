/**
 * Content Script Notes:
 *  This script is injected directly into the MAIN execution World in order to avoid
 *      having to inject additional code into MAIN to retrieve the netflix object
 *  Additionally, because Netflix is an SPA, this script is injected into all pages
 *      on the netflix domain in order to ensure functionality.
 */

/**
 * Shortcut function to retrieve the netflix object's Video Cache which contains
 * information on both Series and Episodes
 * @returns {Object} - The netflix object's Video Cache
 */
function getVideoCache(){
    return netflix.reactContext.pathEvaluator._root.cache.videos;
}

/**
 * Since Netflix is an SPA we watch the app's content for changes in order to update
 * our behaviour.
 */
function setupObserver(){
    let config = {childList: true, subtree: true};
    let observer = new MutationObserver(checkPage);
    observer.observe(document.getElementById("appMountPoint"), config);
}

/**
 * Callback for the MutationObserver. Checks the page's url to determine
 * if the title needs to be updated. Since the Netflix App will change
 * the title periodically, document title is renamed whenever possible.
 */
function checkPage(){
    let match = /netflix.com\/(?<type>title|watch)\/(?<id>\d+)/.exec(window.location.href);
    if(!match) return;
    let info = getVideoCache()[match.groups.id];
    if(match.groups.type == "title") setSeriesTitle(info);
    else setEpisodeTitle(info);
}

/**
 * Updates the document's title based on the currently displayed Series
 * @param {Object} info - The cached information for the Series
 */
function setSeriesTitle(info){
    let title = info.jawSummary.value.title;
    document.title = title + " - Netflix";
}

/**
 * Updates the document's title based on the currently watched Episode
 * @param {Object} info - THe cached information for the Episode
 */
function setEpisodeTitle(info){
    let episodeTitle = info.title.value;
    // DEVNOTE- I don't think ancestor is the correct attribute here, but
    //          that's the place I found the Series' ID when testing
    let seriesid = info.ancestor.value[1];
    // Since we haven't been provided the Series' Cache Info, we'll have to retrieve it
    document.title = episodeTitle + " - " + getVideoCache()[seriesid].jawSummary.value.title + " - Netflix";
}

setupObserver();
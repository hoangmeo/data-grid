class NTAMessageManager {
    _current: any;

    register(ref: any) {
        this._current = ref;
    }
    unregister() {
        this._current = undefined;
    }
    showMessage(title: string, content: string) {
        if (this._current) {
            this._current?.showMessage(title, content);
        }
    }
    close() {
        if (this._current) {
            this._current?.close();
        }
    }
    getCurrent() {
        return this._current;
    }
}
export default new NTAMessageManager();

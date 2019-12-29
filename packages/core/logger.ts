import colors from "colors";

const write = (str: string): boolean => process.stdout.write(str);

const pad = (str: any, char: string, length: number, direction: -1 | 1): string => {
  const missing = length - str.toString().length;
  if (missing <= 0) return str;
  return direction
    ? char.repeat(missing) + str.toString()
    : str.toString() + char.repeat(missing);
};

export class Logger {
  private static timestamp(): string {
    const date = new Date();
    const [hours, minutes, seconds] = [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ].map(v => pad(v, "0", 2, -1));
    return colors.bgCyan(`[${hours}:${minutes}:${seconds}]`);
  }

  private static styledToken(token: string): string {
    return colors.bgYellow.white("[TOKEN]") + " " + colors.yellow(token);
  }

  public static start(token: string): void {
    console.clear();
    write([
      Logger.timestamp(),
      "Discordial",
      colors.bold("@"),
      Logger.styledToken(token) + "\n\n",
    ].join(" "));
  }

  public static loadingPlugin(name: string, isDynamic: boolean): void {
    const type = isDynamic ? "dynamic" : "static";
    write([
      Logger.timestamp(),
      colors.white("Loading"),
      colors.green.bold(name) + colors.magenta.bold(`<${type}>`),
      "...\n",
    ].join(" "));
  }

  public static loadingInjectable(name: string, scope: string, level = 1): void {
    write([
      "   ".repeat(level),
      "↳",
      colors.white("Injecting"),
      colors.yellow.bold(name) + colors.magenta.bold(`<${scope}>`) + "\n",
    ].join(" "));
  }

  public static bindingPlugin(plugin: string): void {
    write([
      Logger.timestamp(),
      colors.white("Binding"),
      colors.green.bold(plugin),
      "...\n",
    ].join(" "));
  }

  public static bindingMethod(methodName: string, eventName: string): void {
    write([
      "   ",
      "↳",
      colors.yellow.bold(methodName),
      "=>",
      colors.blue.italic(eventName) + "\n",
    ].join(" "))
  }

  public static startLoadingPlugins(): void {
    write([
      "\n" + Logger.timestamp(),
      colors.bgRed.white("Loading plugins ...") + "\n",
    ].join(" "));
  }

  public static startBindingEvents(): void {
    write([
      "\n" + Logger.timestamp(),
      colors.bgRed.white("Binding events ...") + "\n",
    ].join(" "));
  }

  public static connected(): void {
    write([
      "\n" + Logger.timestamp(),
      colors.bgGreen.white("Connected successfuly to Discord!") + "\n",
    ].join(" "));
  }

  public static onEvent(event: string, number: number): void {
    write([
      Logger.timestamp(),
      colors.bold.blue(event),
      "=>",
      colors.bold.magenta(number.toString()),
      "method(s) called\n",
    ].join(" "))
  }

  public static onSuccessfulMethodCall(plugin: string, method: string): void {
    write([
      "   ",
      colors.green.bold("✓"),
      colors.yellow.bold(plugin) + `.${method}()\n`,
    ].join(" "));
  }

  public static onFailedMethodCall(plugin: string, method: string): void {
    write([
      "   ",
      colors.red.bold("X"),
      colors.yellow.bold(plugin) + `.${method}()\n`,
    ].join(" "));
  }
};